import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper function to dynamically set the cookie domain
const getCookieDomain = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If running locally on your computer, don't force a custom domain
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
    // If live on Vercel/Vodien, apply the parent domain so all subdomains share logins
    return 'domain=.lotusglobalfoods.com;';
  }
  return '';
};

// Custom storage adapter that saves tokens as cookies shared across subdomains
const cookieStorage = {
  getItem: (key) => {
    const value = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)')
    return value ? value.pop() : null
  },
  setItem: (key, value) => {
    const domainSetting = getCookieDomain();
    document.cookie = `${key}=${value}; ${domainSetting} path=/; max-age=31536000; secure; samesite=lax`;
  },
  removeItem: (key) => {
    const domainSetting = getCookieDomain();
    document.cookie = `${key}=; ${domainSetting} path=/; max-age=0; secure; samesite=lax`;
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})