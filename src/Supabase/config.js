import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjovpyqvtqbueucbrfdc.supabase.co'

// IMPORTANTE: Ve a tu proyecto en supabase.com
// Settings > API > Project API keys > anon (public)
// Pega el valor completo que empieza con "eyJ..."
const supabaseAnonKey = 'PEGA_AQUI_TU_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
