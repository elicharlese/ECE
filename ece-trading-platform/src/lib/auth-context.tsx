'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (provider?: string, credentials?: any) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithWallet: (walletAddress: string, signature: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const loading = status === 'loading';

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const handleSignIn = async (provider?: string, credentials?: any) => {
    if (provider === 'credentials' && credentials) {
      return await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
    } else if (provider === 'google') {
      return await signIn('google', { redirect: false });
    }
    
    return await signIn(provider, { redirect: false });
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setUser(null);
  };

  const signInWithWallet = async (walletAddress: string, signature: string) => {
    try {
      const response = await fetch('/api/auth/wallet-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, signature }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Set user data from wallet signin
        setUser(result.user);
        return { ok: true, user: result.user };
      } else {
        return { ok: false, error: result.error };
      }
    } catch (error) {
      console.error('Wallet signin error:', error);
      return { ok: false, error: 'Failed to sign in with wallet' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signInWithWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
