// --- ASA GENERATED START ---
import { createServerClient } from '@/shared/database/server';
// --- ASA GENERATED END ---

// --- USER CODE START ---
export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; expiresIn: number } | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return null;
  }

  return {
    token: data.session.access_token,
    expiresIn: data.session.expires_in,
  };
}
// --- USER CODE END ---
