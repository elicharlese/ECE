# Authentication System Documentation

## Overview

The ECE Trading Platform includes a comprehensive authentication system supporting multiple sign-in methods:

- **Email/Password Authentication** - Traditional credentials-based authentication
- **Google OAuth** - Social login with Google accounts  
- **Wallet Authentication** - Solana wallet integration (Phantom, Solflare, Backpack)

## Features Implemented

### ✅ Complete Features

1. **Theme-Aware Modal System**
   - All modals and popouts use consistent theme-aware backgrounds
   - Proper dark/light mode support across all UI components
   - Utility classes: `.theme-modal-overlay`, `.theme-modal-content`, `.theme-dropdown`, `.theme-tooltip`

2. **NextAuth.js Integration**
   - Configured with Google OAuth and credentials providers
   - JWT session strategy for stateless authentication
   - Custom sign-in/sign-up pages with modern UI

3. **User Management**
   - In-memory user store for demo purposes (`src/lib/user-store.ts`)
   - User profile management with editable fields
   - Sign-up flow with automatic sign-in after registration

4. **Wallet Authentication (Demo)**
   - Stubbed Solana wallet adapter for development
   - Support for multiple wallet types (Phantom, Solflare, Backpack)
   - Wallet connection modal with theme-aware design
   - Message signing simulation for authentication

5. **Authentication Context**
   - React context for session management
   - Type-safe authentication hooks
   - Automatic session persistence

### 🔄 Partial/Demo Features

1. **Wallet Integration**
   - Currently uses stubbed wallet adapters due to disk space constraints
   - Signature verification is simulated for demo purposes
   - Ready for real Solana wallet adapter integration

## File Structure

```
app/
├── api/auth/
│   ├── [...nextauth]/route.ts          # NextAuth configuration
│   ├── signup/route.ts                 # User registration endpoint
│   └── wallet-signin/route.ts          # Wallet authentication endpoint
├── auth/
│   ├── signin/page.tsx                 # Sign-in page with all auth methods
│   └── signup/page.tsx                 # User registration page
├── profile/page.tsx                    # User profile management
└── layout.tsx                          # Root layout with providers

src/
├── components/
│   └── WalletModal.tsx                 # Wallet connection modal
├── lib/
│   ├── auth-context.tsx                # Authentication context provider
│   ├── user-store.ts                   # In-memory user storage (demo)
│   ├── wallet-context.tsx              # Wallet adapter context (demo)
│   └── theme-context.tsx               # Theme management
└── types/
    └── admin.ts                        # Type definitions
```

## Environment Configuration

Required environment variables in `.env.local`:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Usage Examples

### Sign In with Email/Password

```tsx
import { useAuth } from '@/src/lib/auth-context';

const { signIn } = useAuth();

const handleSignIn = async () => {
  const result = await signIn('credentials', {
    email: 'user@example.com',
    password: 'password123'
  });
  
  if (result?.ok) {
    router.push('/dashboard');
  }
};
```

### Connect Wallet

```tsx
import { useWallet } from '@/src/lib/wallet-context';

const { wallets, select, connect, connected, publicKey } = useWallet();

const handleWalletConnect = async () => {
  select('Phantom');
  await connect();
  
  if (connected && publicKey) {
    console.log('Connected:', publicKey.toBase58());
  }
};
```

### Check Authentication Status

```tsx
import { useAuth } from '@/src/lib/auth-context';

const { session, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!session) return <div>Please sign in</div>;

return <div>Welcome, {session.user.name}!</div>;
```

## Theme System

All authentication modals and components use the theme system:

```css
/* Modal backgrounds automatically adapt to theme */
.theme-modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.theme-modal-content {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* Dark mode overrides */
[data-theme="dark"] .theme-modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}
```

## Next Steps for Production

### High Priority

1. **Install Real Wallet Adapters**
   ```bash
   npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets
   ```

2. **Database Integration**
   - Replace in-memory user store with proper database
   - Add user profile persistence
   - Implement proper session storage

3. **Security Enhancements**
   - Implement real message signing for wallet auth
   - Add rate limiting for authentication endpoints
   - Secure environment variable management

### Medium Priority

1. **Additional Authentication Methods**
   - Discord OAuth
   - Twitter OAuth
   - Email verification for sign-ups

2. **Enhanced User Management**
   - Password reset functionality
   - Two-factor authentication
   - Account deletion and data export

## Testing

The authentication system can be tested in development:

1. **Email/Password**: Use any email with password "password123"
2. **Google OAuth**: Requires valid Google OAuth credentials in env
3. **Wallet Auth**: Uses demo implementation - any wallet selection will work

## Security Notes

- All authentication flows use HTTPS in production
- JWT tokens are securely stored and validated
- CSRF protection is enabled by default with NextAuth
- Wallet signatures use message signing for verification (when implemented)

The authentication system is fully functional for development and demo purposes, with clear paths for production deployment.
