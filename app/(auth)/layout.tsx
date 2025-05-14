import type React from 'react';
import '../(auth)/auth.css';
import { DemoProvider } from '@/lib/demo-context';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoProvider>
      <AuthProvider>
        <div className="auth-layout bg-background">
          {children}
          <Toaster />
        </div>
      </AuthProvider>
    </DemoProvider>
  );
}
