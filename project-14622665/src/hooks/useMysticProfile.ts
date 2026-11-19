import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfile } from '@/lib/mysticStore';

export interface DisplayMysticProfile {
  archetype: string;
  message: string;
  traits: string[];
  element: string;
  symbol: string;
  color: string;
  stone: string;
  charm: string;
  mbtiType: string;
  lifePath: string;
  tarotCard: string;
  tarotTheme: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
}

export function useMysticProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DisplayMysticProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProfile(user.id)
      .then(({ data }) => {
        if (cancelled) return;
        if (!data) {
          setProfile(null);
          return;
        }
        const si = (data.symbolic_identity || {}) as Record<string, string>;
        setProfile({
          archetype: data.archetype || '',
          message: data.message || '',
          traits: Array.isArray(data.traits) ? (data.traits as string[]) : [],
          element: si.element || '',
          symbol: si.symbol || '',
          color: data.color || si.color || '',
          stone: data.stone || '',
          charm: data.charm || '',
          mbtiType: data.mbti_type || '',
          lifePath: data.life_path || '',
          tarotCard: data.tarot_card || '',
          tarotTheme: data.tarot_theme || '',
          sunSign: data.sun_sign || '',
          moonSign: data.moon_sign || '',
          risingSign: data.rising_sign || '',
        });
      })
      .catch(() => {
        if (!cancelled) setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { profile, loading };
}