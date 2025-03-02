
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec les clés réelles
const supabaseUrl = 'https://cfjqqyflqgcgxsbbjvne.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmanFxeWZscWdjZ3hzYmJqdm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzA0MDAsImV4cCI6MjA1NjUwNjQwMH0.OgCAoOZd_gDONiBT6I5l5FXo2cZtGg44XB9SniOaFSw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
