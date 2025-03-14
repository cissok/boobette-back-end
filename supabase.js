// supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://<your-project-id>.supabase.co'; // Remplace par ton URL Supabase
const supabaseKey = 'your-public-anon-key'; // Remplace par ta clé publique

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
