
interface UserSession {
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

// Stocke les données utilisateur dans sessionStorage
export const saveToSession = (key: string, data: any): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to session:", error);
  }
};

// Récupère les données utilisateur depuis sessionStorage
export const getFromSession = (key: string): any => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error getting from session:", error);
    return null;
  }
};

// Met à jour les données de session utilisateur
export const updateUserSession = (userData: Partial<UserSession>): void => {
  try {
    const currentData = getFromSession("userData") || {};
    const updatedData = { ...currentData, ...userData };
    saveToSession("userData", updatedData);
  } catch (error) {
    console.error("Error updating user session:", error);
  }
};

// Sauvegarde les données utilisateur dans localStorage (simulation BDD)
export const saveUserDataToJson = async (): Promise<void> => {
  try {
    const userData = getFromSession("userData");
    
    if (!userData) {
      console.error("Aucune donnée utilisateur trouvée dans la session");
      return;
    }
    
    // Ajouter la date de modification et générer code/montant si nécessaire
    const updatedUserData = {
      ...userData,
      derniereMaj: new Date().toLocaleString('fr-FR'),
      code: userData.code || generateRandomCode(),
      montant: userData.montant || generateRandomAmount()
    };
    
    console.log("Données utilisateur sauvegardées:", updatedUserData);
    
    // Ajoutons les données au stockage local pour simuler une base de données
    const allUsers = getAllUsersData();
    
    // Vérifier si l'utilisateur existe déjà (par email)
    const existingUserIndex = allUsers.findIndex(user => user.email === updatedUserData.email);
    
    if (existingUserIndex !== -1) {
      // Mise à jour de l'utilisateur existant avec fusion des données
      allUsers[existingUserIndex] = {
        ...allUsers[existingUserIndex],
        ...updatedUserData
      };
    } else {
      // Ajout d'un nouvel utilisateur
      allUsers.push(updatedUserData);
    }
    
    // Sauvegarder toutes les données
    localStorage.setItem('allUsersData', JSON.stringify(allUsers));
    
    // Simule un délai pour l'enregistrement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return updatedUserData;
  } catch (error) {
    console.error("Error saving user data to JSON:", error);
    throw error;
  }
};

// Récupère toutes les données utilisateurs (simulation d'une base de données)
export const getAllUsersData = (): UserSession[] => {
  try {
    const allUsers = localStorage.getItem('allUsersData');
    return allUsers ? JSON.parse(allUsers) : [];
  } catch (error) {
    console.error("Error getting all users data:", error);
    return [];
  }
};

// Supprime un utilisateur par son email
export const deleteUserByEmail = (email: string): void => {
  try {
    const allUsers = getAllUsersData();
    const filteredUsers = allUsers.filter(user => user.email !== email);
    localStorage.setItem('allUsersData', JSON.stringify(filteredUsers));
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Vérifie le mot de passe admin
export const checkAdminPassword = (password: string): boolean => {
  // Mot de passe en dur pour cet exemple
  return password === 'admin123';
};

// Générer un code aléatoire pour l'utilisateur
export const generateRandomCode = (): string => {
  return `${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}${Math.floor(Math.random() * 10)}`;
};

// Générer un montant aléatoire pour l'utilisateur
export const generateRandomAmount = (): string => {
  return `${Math.floor(Math.random() * 300) + 50}€`;
};
