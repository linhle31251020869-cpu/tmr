import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { trackEvent, recordVisitOnce } from '@/lib/tracking';
import { sendWelcomeEmail } from '@/lib/emailMarketing';

export interface SignUpMetadata {
  full_name?: string;
  birth_date?: string;
  gender?: string;
  marketing_consent?: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: SignUpMetadata
  ) => Promise<{ error: Error | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      void trackEvent('login', {}, data.user.id);
      // KHÔNG gửi email welcome khi đăng nhập.
      // Email welcome chỉ được kích hoạt cho một đăng ký mới thành công.
    }
    return { error };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, metadata?: SignUpMetadata) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: metadata ? { data: metadata } : undefined,
      });
      const needsConfirmation = !data.session && !data.user?.identities?.length;
      // CHỈ gửi email welcome khi đăng ký thành công VÀ tài khoản đã được kích hoạt
      // (có session ngay, tức không cần xác nhận email qua hộp thư).
      // Nếu đăng ký thất bại hoặc thiếu email thì hàm gửi tự bỏ qua an toàn.
      if (!error && data.session && data.user?.email) {
        void sendWelcomeEmail();
      }
      return { error, needsConfirmation };
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  // Ghi nhận lượt truy cập website (mỗi phiên 1 lần) khi user đã đăng nhập.
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      void recordVisitOnce();
    }, 800);
    return () => clearTimeout(timer);
  }, [user?.id]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}