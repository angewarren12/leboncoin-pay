
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
    
    // Enregistrer dans Supabase
    console.log("Saving user data to Supabase:", userData);
    
    try {
      // Upsert user data to Supabase
      const result = await upsertUser(userData);
      
      // Simule un délai pour l'enregistrement (peut être supprimé en production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return result;
    } catch (error: any) {
      if (error.isRlsError) {
        console.error("Erreur RLS lors de la sauvegarde des données:", error);
        throw {
          message: "Erreur de sécurité: Row Level Security (RLS) empêche la sauvegarde des données",
          isRlsError: true,
          originalError: error
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("Error saving user data to Supabase:", error);
    throw error;
  }
};

// Récupère toutes les données utilisateurs depuis Supabase
export const getAllUsersData = async (): Promise<UserData[]> => {
  try {
    return await fetchAllUsers();
  } catch (error: any) {
    console.error("Error getting all users data:", error);
    if (error.isRlsError) {
      console.error("Erreur RLS lors de la récupération des données:", error);
      throw {
        message: "Erreur de sécurité: Row Level Security (RLS) empêche l'accès aux données",
        isRlsError: true,
        originalError: error
      };
    }
    return [];
  }
};

// Supprime un utilisateur par son email via Supabase
export const deleteUserByEmail = async (email: string): Promise<boolean> => {
  try {
    await deleteUser(email);
    return true;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (error.isRlsError) {
      throw {
        message: "Erreur de sécurité: Row Level Security (RLS) empêche la suppression des données",
        isRlsError: true,
        originalError: error
      };
    }
    throw error;
  }
};

// Vérifie le mot de passe admin
export const checkAdminPassword = (password: string): boolean => {
  // Mot de passe en dur pour cet exemple
  return password === 'admin123';
};
