
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

// Sauvegarde les données utilisateur dans un fichier JSON
export const saveUserDataToJson = async (): Promise<void> => {
  try {
    const userData = getFromSession("userData");
    
    // En environnement de production, vous utiliseriez une API backend
    // Mais pour cet exemple, nous allons simuler la sauvegarde côté client
    console.log("User data saved to data.json:", userData);
    
    // Simule un délai pour l'enregistrement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return userData;
  } catch (error) {
    console.error("Error saving user data to JSON:", error);
    throw error;
  }
};
