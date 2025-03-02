
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

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
  derniereMaj?: string;
}

// Function to get user by email
export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data;
};

// Function to insert or update user
export const upsertUser = async (userData: UserData) => {
  // Add the last updated timestamp
  const updatedUserData = {
    ...userData,
    derniereMaj: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('users')
    .upsert(updatedUserData, { 
      onConflict: 'email',
      ignoreDuplicates: false
    })
    .select();

  if (error) {
    console.error('Error upserting user:', error);
    throw error;
  }

  return data;
};

// Function to get all users
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching all users:', error);
    return [];
  }

  return data;
};

// Function to delete a user by email
export const deleteUserByEmail = async (email: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('email', email);

  if (error) {
    console.error('Error deleting user:', error);
    throw error;
  }

  return true;
};
