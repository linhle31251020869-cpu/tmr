import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string;

// Custom lock function to avoid cross-tab lock contention freezing the page
const customLock = async (name: string, acquireTimeout: number, fn: () => Promise<unknown>) => {
  if (typeof navigator !== 'undefined' && 'locks' in navigator) {
    try {
      return await (navigator as Navigator).locks.request(name, { mode: 'exclusive' }, async () => {
        const result = await Promise.race([
          fn(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Lock acquisition timed out')), acquireTimeout)
          ),
        ]);
        return result;
      });
    } catch {
      return fn();
    }
  }
  return fn();
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: customLock,
  },
});

export default supabase;