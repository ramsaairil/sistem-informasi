import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ddpvnyhwdsoseykgpdqc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcHZueWh3ZHNvc2V5a2dwZHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2ODkwNDYsImV4cCI6MjA4MzI2NTA0Nn0.Xj1KUwBQ3dMWfKcEnm4FO1p0bwlfozirDitv3pSkiyk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
