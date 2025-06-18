'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/lib/auth-context';
import { useTheme } from '@/src/lib/theme-context';
import { BottomNavigation } from '@/src/components/bottom-navigation';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  Save, 
  Loader2,
  Camera,
  Bell,
  Shield,
  Wallet,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        company: user.profile?.company || '',
        phone: user.profile?.phone || '',
        notifications: user.profile?.notifications || {
          email: true,
          push: true,
          sms: false,
        },
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-theme-accent" />
          <p className="text-theme-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-theme-background rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-theme-text-primary" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-theme-text-primary">Profile Settings</h1>
            <p className="text-theme-text-secondary">Manage your account information and preferences</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <p className={`text-sm ${
              message.type === 'success' 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-theme-accent text-white rounded-full flex items-center justify-center hover:bg-theme-accent/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-theme-text-primary mb-1">
                  {user.name || 'User'}
                </h2>
                <p className="text-theme-text-secondary mb-2">{user.email}</p>
                
                {/* Account Type */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-theme-accent/10 text-theme-accent rounded-full text-sm font-medium mb-4">
                  {user.provider === 'google' && (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google Account
                    </>
                  )}
                  {user.provider === 'solana' && (
                    <>
                      <Wallet className="w-4 h-4" />
                      Wallet Account
                    </>
                  )}
                  {user.provider === 'credentials' && (
                    <>
                      <Mail className="w-4 h-4" />
                      Email Account
                    </>
                  )}
                </div>

                {user.walletAddress && (
                  <div className="text-xs text-theme-text-secondary bg-theme-background p-2 rounded-lg font-mono break-all">
                    {user.walletAddress}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-theme-text-primary mb-6">Personal Information</h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                      placeholder="Last name"
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-theme-background border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent transition-colors"
                      placeholder="Your email address"
                      disabled={user.provider === 'google'}
                    />
                  </div>
                  {user.provider === 'google' && (
                    <p className="text-xs text-theme-text-secondary mt-1">
                      Email cannot be changed for Google accounts
                    </p>
                  )}
                </div>

                {/* Company Field */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-theme-text-primary mb-2">
                    Company
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

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-theme-text-primary mb-2">
                    Phone Number
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

                {/* Notification Preferences */}
                <div>
                  <h4 className="text-lg font-semibold text-theme-text-primary mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: { ...formData.notifications, email: e.target.checked }
                        })}
                        className="w-4 h-4 text-theme-accent bg-theme-background border-theme-border rounded focus:ring-theme-accent focus:ring-2"
                      />
                      <span className="text-theme-text-primary">Email notifications</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.notifications.push}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: { ...formData.notifications, push: e.target.checked }
                        })}
                        className="w-4 h-4 text-theme-accent bg-theme-background border-theme-border rounded focus:ring-theme-accent focus:ring-2"
                      />
                      <span className="text-theme-text-primary">Push notifications</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.notifications.sms}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: { ...formData.notifications, sms: e.target.checked }
                        })}
                        className="w-4 h-4 text-theme-accent bg-theme-background border-theme-border rounded focus:ring-theme-accent focus:ring-2"
                      />
                      <span className="text-theme-text-primary">SMS notifications</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-theme-accent text-white py-3 px-4 rounded-xl font-semibold hover:bg-theme-accent/90 focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-6 py-3 border border-theme-border text-theme-text-primary rounded-xl font-semibold hover:bg-theme-background transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
