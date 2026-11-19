import { supabase } from '@/lib/supabase';

export interface MysticResult {
  experience_type: string;
  result_data: Record<string, unknown>;
}

export interface MysticProfileData {
  archetype?: string;
  traits?: string[];
  symbolic_identity?: Record<string, unknown>;
  message?: string;
  recommendations?: string[];
  mbti_type?: string;
  life_path?: string;
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  tarot_card?: string;
  tarot_theme?: string;
  stone?: string;
  charm?: string;
  color?: string;
}

// Save a single experience result
export async function saveResult(userId: string, experienceType: string, resultData: Record<string, unknown>) {
  const { error } = await supabase.from('mystic_results').insert({
    user_id: userId,
    experience_type: experienceType,
    result_data: resultData,
  });
  return { error };
}

// Fetch all results for a user
export async function getResults(userId: string) {
  const { data, error } = await supabase
    .from('mystic_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

// Fetch the user's Mystic Profile (or null if not yet created)
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('mystic_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data, error };
}

// Upsert the user's Mystic Profile
export async function saveProfile(userId: string, profileData: MysticProfileData) {
  const existing = await getProfile(userId);
  if (existing.data) {
    const { error } = await supabase
      .from('mystic_profiles')
      .update({ ...profileData, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    return { error };
  }
  const { error } = await supabase.from('mystic_profiles').insert({
    user_id: userId,
    ...profileData,
  });
  return { error };
}