'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/lib/auth-context';
import { useTheme } from '@/src/lib/theme-context';
import WalletModal from '@/src/components/WalletModal';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  Wallet
} from 'lucide-react';

function SignInForm() {
  const { theme } = useTheme();
  const { signIn, signInWithWallet } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', formData);
      
      if (result?.ok) {
        router.push(callbackUrl);
      } else {
        setError(result?.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('google');
      if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async (publicKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate a message to sign for verification
      const message = `Sign this message to authenticate with ECE Trading Platform.\n\nTimestamp: ${Date.now()}`;
      const mockSignature = 'mock_signature_' + Date.now();
      
      const result = await signInWithWallet(publicKey, mockSignature);
      
      if (result?.ok) {
        router.push(callbackUrl);
      } else {
        setError(result?.error || 'Failed to connect wallet');
      }
    } catch (err) {
      setError('Wallet connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-theme-text-secondary hover:text-theme-text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h2 className="text-3xl font-bold text-theme-text-primary mb-2">
            Welcome Back
          </h2>
          <p className="text-theme-text-secondary">
            Sign in to your ECE Trading account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Sign In Form */}
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-text-secondary" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-theme-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-text-secondary" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-theme-accent text-white py-3 px-4 rounded-xl font-semibold hover:bg-theme-accent/90 focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-theme-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-theme-surface text-theme-text-secondary">Or continue with</span>
            </div>
          </div>

          {/* Social Sign In Options */}
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-theme-border rounded-xl hover:bg-theme-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-theme-text-primary font-medium">Continue with Google</span>
            </button>

            {/* Wallet Connect */}
            <button
              type="button"
              onClick={() => setShowWalletModal(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-theme-border rounded-xl hover:bg-theme-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="w-5 h-5 text-theme-text-primary" />
              <span className="text-theme-text-primary font-medium">Connect Wallet</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-4 border-t border-theme-border">
            <p className="text-theme-text-secondary">
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="text-theme-accent hover:text-theme-accent/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Wallet Modal */}
        <WalletModal 
          isOpen={showWalletModal} 
          onClose={() => setShowWalletModal(false)} 
          onConnected={handleWalletConnect}
        />
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
