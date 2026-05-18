import { createClient } from '@supabase/supabase-js';

// Cliente do Supabase externo (projeto do usuário) — usado para salvar os
// envios da ficha de anamnese na tabela "Dados".
const SUPABASE_URL = 'https://rakfndemfuusdbpeaein.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJha2ZuZGVtZnV1c2RicGVhZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjYwNzIsImV4cCI6MjA5NDcwMjA3Mn0.wAegJnGdENja5F_pH7vtdIjFWc_NBtlrZrH7P6GLlJc';

export const externalSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
