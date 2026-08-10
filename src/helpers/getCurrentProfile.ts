import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
import { UserProfile } from '../types';

/**
 * The authenticated layout already guarantees a profile exists; pages call this
 * when they need the role (admin-only actions) or the id (MOTM votes).
 */
export async function getCurrentProfile(
  supabase: SupabaseClient<Database>
): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}
