
import { supabase } from './client';

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
