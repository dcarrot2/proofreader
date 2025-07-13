import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const TABLES = {
  SUBMISSIONS: 'submissions',
}

export async function createClient() {
  const cookieStore = await cookies();


  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
            try {
                cookiesToSet.forEach((cookie) => {
                    cookieStore.set(cookie.name, cookie.value, cookie.options);
                });
            } catch (error) {
                console.error('Error setting cookies:', error);
            }
        }
      }
    }
  )
}