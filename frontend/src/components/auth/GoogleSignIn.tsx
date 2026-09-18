import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  className?: string;
  onSuccess?: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

const GOOGLE_CLIENT_ID = import.meta.env['VITE_GOOGLE_CLIENT_ID'] || '509974976339-bpan5hceh940oqgki7adq041nnv6gldc.apps.googleusercontent.com';

export function GoogleSignIn({ className = '', onSuccess, text = 'continue_with' }: GoogleSignInProps) {
  const { googleLogin, isLoading } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const tokenClientRef = useRef<any>(null);

  useEffect(() => {
    // Check if script is already present
    if (window.google?.accounts?.oauth2) {
      setScriptLoaded(true);
      initializeOAuth();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      initializeOAuth();
    };
    script.onerror = () => {
      setError('Failed to load Google Sign-In service');
      console.error('Failed to load Google Identity Services script');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeOAuth = () => {
    if (!window.google?.accounts?.oauth2) return;

    try {
      console.log('Initializing Google OAuth token client...');
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: handleTokenResponse,
      });

      // Also initialize Google ID services for fallback One Tap
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
        });
      }
    } catch (err) {
      console.error('Error initializing Google client:', err);
    }
  };

  const handleTokenResponse = async (response: any) => {
    console.log('Google token response received:', response);
    if (response.error) {
      console.error('Google OAuth error:', response.error);
      setIsProcessing(false);
      setError(response.error_description || response.error || 'Google sign-in was cancelled');
      return;
    }

    if (response.access_token) {
      try {
        setIsProcessing(true);
        setError(null);
        await googleLogin(response.access_token, 'accessToken');
        console.log('Google login successful via access token');
        if (onSuccess) {
          onSuccess();
        }
      } catch (err: any) {
        console.error('Google login error:', err);
        setError(err.message || 'Google sign-in failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCredentialResponse = async (response: any) => {
    console.log('Google credential response received:', response);
    if (response.credential) {
      try {
        setIsProcessing(true);
        setError(null);
        await googleLogin(response.credential, 'credential');
        console.log('Google login successful via credential');
        if (onSuccess) {
          onSuccess();
        }
      } catch (err: any) {
        console.error('Google login error:', err);
        setError(err.message || 'Google sign-in failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClick = () => {
    setError(null);
    if (isLoading || isProcessing) return;

    if (tokenClientRef.current) {
      try {
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        console.error('Failed to request access token:', err);
        if (window.google?.accounts?.id) {
          window.google.accounts.id.prompt();
        } else {
          setError('Google Sign-In is initializing. Please try again in a moment.');
        }
      }
    } else if (window.google?.accounts?.oauth2) {
      initializeOAuth();
      tokenClientRef.current?.requestAccessToken({ prompt: 'select_account' });
    } else {
      setError('Google Sign-In is not ready yet. Please check your connection.');
    }
  };

  const getButtonLabel = () => {
    if (text === 'signin_with') return 'Sign in with Google';
    if (text === 'signup_with') return 'Sign up with Google';
    return 'Continue with Google';
  };

  const busy = isLoading || isProcessing;

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-label={getButtonLabel()}
        className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.05] active:scale-[0.985] backdrop-blur-xl backdrop-saturate-150 text-white font-medium text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.37)] hover:border-cyan-400/40 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_12px_40px_rgba(0,229,255,0.12)] transition-all duration-300 overflow-hidden cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Ambient shimmer reflection wave */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Centered Logo & Text */}
        <div className="flex items-center justify-center gap-3 z-10 pointer-events-none">
          {busy ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400 shrink-0" />
          ) : (
            <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span className="tracking-wide font-medium">
            {busy ? 'Connecting to Google...' : getButtonLabel()}
          </span>
        </div>
      </button>

      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}