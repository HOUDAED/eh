// Copie ce fichier → supabase-client.js et remplis les valeurs
// supabase-client.js est dans .gitignore (ne jamais commiter les clés)
//
// Trouve ces valeurs dans : Supabase → Settings → API

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://XXXX.supabase.co';   // ← URL du projet
const SUPABASE_KEY = 'eyJ...';                       // ← clé "anon public"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
