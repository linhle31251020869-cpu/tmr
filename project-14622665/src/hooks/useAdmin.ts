import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

/**
 * Kiểm tra người dùng hiện tại có phải admin không.
 * Dựa vào hàm `is_admin()` đã có sẵn trong database (so email với bảng admin_users).
 */
export function useAdmin(): { isAdmin: boolean; checking: boolean } {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    if (!user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }

    setChecking(true);
    supabase
      .rpc('is_admin')
      .then(({ data, error }) => {
        if (!active) return;
        setIsAdmin(!error && data === true);
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  return { isAdmin, checking };
}