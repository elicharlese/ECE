'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/lib/auth-context';
import { useTheme } from '@/src/lib/theme-context';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  User,
  Building,
  Phone,
  CheckCircle
} from 'lucide-react';

export default function SignUpPage() {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Auto sign in after successful registration
        setTimeout(async () => {
          const signInResult = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
          });
          
          if (signInResult?.ok) {
            router.push('/dashboard');
          }
        }, 2000);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <div className="max-w-md w-full text-center">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-text-primary mb-2">
              Account Created!
            </h2>
            <p className="text-theme-text-secondary mb-4">
              Welcome to ECE Trading! You're being signed in automatically...
            </p>
            <div className="flex items-center justify-center gap-2 text-theme-text-secondary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing you in...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Create Account
          </h2>
          <p className="text-theme-text-secondary">
            Join ECE Trading and start building custom apps
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Sign Up Form */}
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-theme-text-primary mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-text-secondary" />
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value, name: `${e.target.value} ${formData.lastName}`.trim() })}
                    className="w-full pl-12 pr-4 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                    placeholder="First name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-theme-text-primary mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value, name: `${formData.firstName} ${e.target.value}`.trim() })}
                  className="w-full px-4 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-text-primary mb-2">
                Email Address *
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
                Password *
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
                  placeholder="Create a password (min. 6 characters)"
                  minLength={6}
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

            {/* Optional Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-theme-text-primary mb-2">
                  Company (Optional)
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-text-secondary" />
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-theme-text-primary mb-2">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-text-secondary" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                    placeholder="Your phone number"
                  />
                </div>
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6 pt-4 border-t border-theme-border">
            <p className="text-theme-text-secondary">
              Already have an account?{' '}
              <Link 
                href="/auth/signin" 
                className="text-theme-accent hover:text-theme-accent/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
