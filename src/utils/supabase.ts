import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === "your-supabase-url-here" ||
    supabaseAnonKey === "your-supabase-anon-key-here"
  ) {
    // Return a mock client for demo purposes
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithOAuth: async () => ({ data: null, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
      from: () => ({
        select: () => ({
          order: () => ({
            data: null,
            error: null,
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => ({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({ data: null, error: null }),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient;
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// Export as a singleton for convenience
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop) => {
    const client = getSupabase();
    return (client as any)[prop];
  },
});

