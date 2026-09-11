// lpm/src/App.jsx
import { useState, useEffect } from 'react';
import SharedLogin from './components/SharedLogin';
import ComingSoon from './components/ComingSoon';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { supabase } from './supabaseClient';

export default function LPMApp() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Detect if running as an installed PWA
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true; // iOS Safari fallback
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Capture Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // 2. Fetch User Profile
  const fetchProfile = async (userId, retries = 2) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, block_no, unit_no, condo_name')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchProfile(userId, retries - 1), 800);
      }
    }
  };

  // 3. Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      } else if (!currentSession) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (userPayload) => {
    if (userPayload === 'guest') {
      setSession({ isGuest: true, user: { full_name: 'Guest Neighbor' } });
      setProfile(null);
    } else {
      setSession({ isGuest: false, user: userPayload });
      fetchProfile(userPayload.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-500 flex items-center justify-center text-black font-extrabold text-xl">
        Loading Lotus Mart...
      </div>
    );
  }

  // GATE 1: User has not installed the PWA (browsing in Chrome/Safari)
  if (!isStandalone) {
    return (
      <PWAInstallPrompt
        deferredPrompt={deferredPrompt}
        onInstalled={() => setIsStandalone(true)}
      />
    );
  }

  // GATE 2: App is installed, but user is not logged in
  if (!session) {
    return (
      <SharedLogin
        tagline="Powered by Lotus Global Foods"
        onSuccessfulLogin={handleLoginSuccess}
      />
    );
  }

  // GATE 3: App is installed and user is verified -> Show Coming Soon Page
  return (
    <ComingSoon
      user={profile || session.user}
      isGuest={Boolean(session.isGuest)}
      onLogout={handleLogout}
    />
  );
}