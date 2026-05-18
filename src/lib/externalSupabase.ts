import { createClient } from '@supabase/supabase-js';

// Cliente do Supabase externo (projeto do usuário) — usado para salvar os
// envios da ficha de anamnese na tabela "Dados".
const SUPABASE_URL = 'https://eujxabpoxcdxrcohpezm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1anhhYnBveGNkeHJjb2hwZXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzIyMjAsImV4cCI6MjA5NDcwODIyMH0.1UumfG9VdNYSigiEUTKi1BTWb01B0EWQo_tZqMImwME';

export const externalSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
