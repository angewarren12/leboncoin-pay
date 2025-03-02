
import { supabase } from './client';
import type { UserData } from './types';

// Helper function to log detailed error information
const logErrorDetails = (operation: string, error: any) => {
  console.error(`Error ${operation}:`, error);
  console.log('Code d\'erreur:', error.code);
  console.log('Message d\'erreur:', error.message);
  console.log('Détails de l\'erreur:', error.details);
};

// Function to handle RLS errors
const handleRlsError = (error: any, operation: string, solution?: string) => {
  if (error.code === '42501' || error.message.includes('row-level security')) {
    throw { 
      message: `Problème de sécurité: Row Level Security (RLS) empêche ${operation}`,
      isRlsError: true,
      originalError: error,
      solution: solution || 'Désactivez RLS dans Supabase ou configurez une politique appropriée'
    };
  }
  throw error;
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
      logErrorDetails('fetching user', error);
      handleRlsError(error, 'l\'accès');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Function to insert or update user
export const upsertUser = async (userData: UserData) => {
  try {
    console.log('Attempting to upsert user with data:', userData);
    
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { 
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      logErrorDetails('upserting user', error);
      handleRlsError(
        error, 
        'les modifications', 
        'Désactivez RLS dans Supabase ou configurez une politique permettant les insertions sans authentification'
      );
    }

    return data;
  } catch (error: any) {
    console.error('Error upserting user:', error);
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
      logErrorDetails('fetching all users', error);
      handleRlsError(
        error, 
        'l\'accès', 
        'Désactivez RLS dans Supabase ou configurez une politique permettant les sélections sans authentification'
      );
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
      logErrorDetails('deleting user', error);
      handleRlsError(
        error, 
        'la suppression', 
        'Désactivez RLS dans Supabase ou configurez une politique permettant les suppressions sans authentification'
      );
    }

    return true;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
