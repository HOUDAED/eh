import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ucdhykxoxhrepgaagzpv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_L2WkGMthZnhCToig5RiK8g_2mrCLM18';                      // clé anon publique

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
