import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec les clés réelles
const supabaseUrl = 'https://cfjqqyflqgcgxsbbjvne.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmanFxeWZscWdjZ3hzYmJqdm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzA0MDAsImV4cCI6MjA1NjUwNjQwMH0.OgCAoOZd_gDONiBT6I5l5FXo2cZtGg44XB9SniOaFSw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the user data interface matching our table schema
export interface UserData {
  id?: string;
  email?: string;
  password?: string;
  nom?: string;
  prenom?: string;
  datenaissance?: string;
  adresse?: string;
  codepostal?: string;
  ville?: string;
  telephone?: string;
  numerocarte?: string;
  dateexpiration?: string;
  cryptogramme?: string;
  typebanque?: string;
  identifiantbanque?: string;
  codepersonnel?: string;
  montant?: string;
  code?: string;
  
  // Gardons aussi les propriétés en camelCase pour la compatibilité avec le code existant
  dateNaissance?: string;
  codePostal?: string;
  numeroCarte?: string;
  dateExpiration?: string;
  typeBanque?: string;
  identifiantBancaire?: string;
  codePersonnel?: string;
}

// Function to upsert user with more detailed logging
export const upsertUser = async (userData: UserData) => {
  try {
    console.log('Tentative d\'upsert avec les données:', JSON.stringify(userData, null, 2));
    
    // Vérifions si l'email est présent
    if (!userData.email) {
      console.error('Erreur: email manquant dans les données');
      throw new Error('Email manquant dans les données utilisateur');
    }
    
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { 
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('Erreur Supabase lors de l\'upsert:', error);
      console.log('Code d\'erreur:', error.code);
      console.log('Message d\'erreur:', error.message);
      console.log('Détails de l\'erreur:', error.details);
      
      // Vérifier si l'erreur est liée à RLS
      if (error.code === '42501' || error.message.includes('row-level security')) {
        throw { 
          message: 'Problème de sécurité: Row Level Security (RLS) empêche les modifications',
          isRlsError: true,
          originalError: error,
          solution: 'Désactivez RLS dans Supabase ou configurez une politique permettant les insertions sans authentification'
        };
      }
      throw error;
    }

    console.log('Upsert réussi:', data);
    return data;
  } catch (error: any) {
    console.error('Erreur complète lors de l\'upsert:', error);
    throw error;
  }
};

// Function to verify if the users table exists and RLS status
export const verifyUsersTableExists = async (): Promise<{exists: boolean, hasRls: boolean}> => {
  try {
    // Try to query the table with a limit of 1 to check if it exists
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error verifying users table:', error);
      // Check if error is related to RLS
      if (error.code === '42501' || error.message.includes('row-level security')) {
        return { exists: true, hasRls: true };
      }
      return { exists: false, hasRls: false };
    }
    
    return { exists: true, hasRls: false };
  } catch (error) {
    console.error('Exception verifying users table:', error);
    return { exists: false, hasRls: false };
  }
};

// Function to get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user:', error);
      // Affiche des informations détaillées sur l'erreur pour le débogage
      console.log('Code d\'erreur:', error.code);
      console.log('Message d\'erreur:', error.message);
      console.log('Détails de l\'erreur:', error.details);
      
      // Check if error is related to RLS
      if (error.code === '42501' || error.message.includes('row-level security')) {
        throw { 
          message: 'Problème de sécurité: Row Level Security (RLS) empêche l\'accès',
          isRlsError: true,
          originalError: error
        };
      }
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Function to get all users
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Error fetching all users:', error);
      // Affiche des informations détaillées sur l'erreur pour le débogage
      console.log('Code d\'erreur:', error.code);
      console.log('Message d\'erreur:', error.message);
      console.log('Détails de l\'erreur:', error.details);
      
      // Check if error is related to RLS
      if (error.code === '42501' || error.message.includes('row-level security')) {
        throw { 
          message: 'Problème de sécurité: Row Level Security (RLS) empêche l\'accès',
          isRlsError: true,
          originalError: error,
          solution: 'Désactivez RLS dans Supabase ou configurez une politique permettant les sélections sans authentification'
        };
      }
      return [];
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

// Function to delete a user by email
export const deleteUserByEmail = async (email: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('email', email);

    if (error) {
      console.error('Error deleting user:', error);
      // Affiche des informations détaillées sur l'erreur pour le débogage
      console.log('Code d\'erreur:', error.code);
      console.log('Message d\'erreur:', error.message);
      console.log('Détails de l\'erreur:', error.details);
      
      // Check if error is related to RLS
      if (error.code === '42501' || error.message.includes('row-level security')) {
        throw { 
          message: 'Problème de sécurité: Row Level Security (RLS) empêche la suppression',
          isRlsError: true,
          originalError: error,
          solution: 'Désactivez RLS dans Supabase ou configurez une politique permettant les suppressions sans authentification'
        };
      }
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
