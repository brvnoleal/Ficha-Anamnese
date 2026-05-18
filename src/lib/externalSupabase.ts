import { createClient } from '@supabase/supabase-js';

// Cliente do Supabase externo (projeto do usuário) — usado para salvar os
// envios da ficha de anamnese na tabela "Dados".
const SUPABASE_URL = 'https://rakfndemfuusdbpeaein.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_L3lE2w9wN34a0YdR5_yjEg_RtLhZe2r';

export const externalSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
