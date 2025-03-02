
// Re-export everything from our new modular files for backward compatibility
export { supabase } from './supabase/client';
export type { UserData } from './supabase/types';
export { verifyUsersTableExists } from './supabase/tableVerification';
export { getUserByEmail, upsertUser, getAllUsers, deleteUserByEmail } from './supabase/userOperations';
