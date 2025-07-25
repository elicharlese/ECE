'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react'
import { Navigation } from '../../components/navigation'
import { Button } from '../../components/ui/button'
import { GlassCard } from '../../components/ui/glass-card'
import { AuthScene3D } from '../../components/3d/auth-scene'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    receiveUpdates: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up attempt:', formData)
  }

  const passwordMatch = formData.password === formData.confirmPassword
  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.password && formData.confirmPassword && passwordMatch && 
                     formData.acceptTerms

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
        {/* 3D Background Scene */}
        <AuthScene3D className="z-0" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
              x: [0, 100, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-96 h-96 bg-ocean-info/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -10, 0],
              x: [0, -100, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-ocean-accent/10 rounded-full blur-3xl"
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard variant="dark" animation="breathe" className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-16 h-16 bg-gradient-ocean rounded-lg mx-auto mb-4"
                />
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Join ECE Cards
                </h1>
                <p className="text-muted-foreground">
                  Start your trading card collection today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ocean-primary dark:text-ocean-light" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary focus:border-transparent backdrop-blur-sm"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary focus:border-transparent backdrop-blur-sm"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>                    <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ocean-primary dark:text-ocean-light" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ocean-primary dark:text-ocean-light" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary focus:border-transparent backdrop-blur-sm"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ocean-primary dark:text-ocean-light hover:text-ocean-accent transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ocean-primary dark:text-ocean-light" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                        formData.confirmPassword && passwordMatch 
                          ? 'border-ocean-success focus:ring-ocean-success' 
                          : formData.confirmPassword && !passwordMatch
                          ? 'border-beach-alert focus:ring-beach-alert'
                          : 'border-white/20 focus:ring-beach-primary'
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      {formData.confirmPassword && passwordMatch && (
                        <Check className="w-5 h-5 text-ocean-success" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-ocean-primary dark:text-ocean-light hover:text-ocean-accent transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {formData.confirmPassword && !passwordMatch && (
                    <p className="mt-1 text-sm text-beach-alert">Passwords don't match</p>
                  )}
                </div>

                {/* Terms and Updates */}
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1 text-beach-primary bg-white/10 border-white/20 rounded focus:ring-beach-primary focus:ring-2"
                      required
                    />
                    <span className="ml-2 text-sm text-muted-foreground">
                      I agree to the{' '}
                      <Link href="/terms" className="text-beach-primary hover:text-beach-accent transition-colors">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-beach-primary hover:text-beach-accent transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="receiveUpdates"
                      checked={formData.receiveUpdates}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1 text-beach-primary bg-white/10 border-white/20 rounded focus:ring-beach-primary focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">
                      I'd like to receive updates about new cards and features
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="accent" 
                  className="w-full group"
                  disabled={!isFormValid}
                >
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Demo Button */}
                <Link href="/app">
                  <Button variant="primary" className="w-full">
                    Try Demo Instead
                  </Button>
                </Link>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-muted-foreground text-sm">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Social Sign Up */}
              <div className="space-y-3">
                <Button variant="ghost" className="w-full">
                  Continue with Google
                </Button>
                <Button variant="ghost" className="w-full">
                  Continue with Apple
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    href="/signin" 
                    className="text-beach-primary hover:text-beach-accent transition-colors font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
