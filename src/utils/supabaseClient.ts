
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
}

// Function to verify if the users table exists
export const verifyUsersTableExists = async (): Promise<boolean> => {
  try {
    // Try to query the table with a limit of 1 to check if it exists
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error verifying users table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception verifying users table:', error);
    return false;
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
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Function to insert or update user
export const upsertUser = async (userData: UserData) => {
  try {
    // We're not adding derniereMaj here since we'll let the database handle it with the DEFAULT NOW() setting
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { 
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('Error upserting user:', error);
      throw error;
    }

    return data;
  } catch (error) {
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
      console.error('Error fetching all users:', error);
      return [];
    }

    return data;
  } catch (error) {
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
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
