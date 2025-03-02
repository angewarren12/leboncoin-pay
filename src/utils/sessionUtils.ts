
import { getUserByEmail, upsertUser, getAllUsers as fetchAllUsers, deleteUserByEmail as deleteUser } from './supabaseClient';
import type { UserData } from './supabaseClient';

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
export const updateUserSession = (userData: Partial<UserData>): void => {
  try {
    const currentData = getFromSession("userData") || {};
    const updatedData = { ...currentData, ...userData };
    saveToSession("userData", updatedData);
  } catch (error) {
    console.error("Error updating user session:", error);
  }
};

// Sauvegarde les données utilisateur dans Supabase
export const saveUserDataToJson = async (): Promise<any> => {
  try {
    const userData = getFromSession("userData");
    
    // Ajouter la date de modification
    const updatedUserData = {
      ...userData,
      derniereMaj: new Date().toISOString()
    };
    
    // Enregistrer dans Supabase
    console.log("Saving user data to Supabase:", updatedUserData);
    
    // Upsert user data to Supabase
    const result = await upsertUser(updatedUserData);
    
    // Simule un délai pour l'enregistrement (peut être supprimé en production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return result;
  } catch (error) {
    console.error("Error saving user data to Supabase:", error);
    throw error;
  }
};

// Récupère toutes les données utilisateurs depuis Supabase
export const getAllUsersData = async (): Promise<UserData[]> => {
  try {
    return await fetchAllUsers();
  } catch (error) {
    console.error("Error getting all users data:", error);
    return [];
  }
};

// Supprime un utilisateur par son email via Supabase
export const deleteUserByEmail = async (email: string): Promise<void> => {
  try {
    await deleteUser(email);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Vérifie le mot de passe admin
export const checkAdminPassword = (password: string): boolean => {
  // Mot de passe en dur pour cet exemple
  return password === 'admin123';
};
