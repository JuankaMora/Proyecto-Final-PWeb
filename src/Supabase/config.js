import { createClient } from '@supabase/supabase-js'

// Reemplaza estos valores con los que copiaste en el Paso B de la consola
const supabaseUrl = 'https://kjovpyqvtqbueucbrfdc.supabase.co'
const supabaseAnonKey = 'https://kjovpyqvtqbueucbrfdc.supabase.co/rest/v1/'

// Inicializar el cliente único de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)