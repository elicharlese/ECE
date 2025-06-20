# ECE Trading Platform

A revolutionary digital app marketplace where applications are traded like trading cards. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Tinder-Style Discovery**: Swipe through apps to discover your next favorite tool
- **Trading Card System**: Every app becomes a collectible trading card with stats and rarity
- **Portfolio Management**: Track your app collection and their performance
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Design**: Perfect experience on all devices

## 🌟 User Flow

### For Users
1. **Landing Page** (`/`) - Welcome page with overview and navigation
2. **Discover** (`/swipe`) - Tinder-style app discovery (main experience)
3. **Marketplace** (`/marketplace`) - Browse all available apps
4. **Portfolio** (`/dashboard`) - View your app collection
5. **Order** (`/order`) - Commission custom applications

### For Admins
1. **Admin Login** - Access via "Admin" button on landing page
2. **Admin Dashboard** (`/admin-super`) - Comprehensive management panel
   - Order management
   - Customer analytics
   - App management
   - Financial analytics
   - System health monitoring
   - Security management

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **UI**: Custom components with theme support
- **State**: React hooks with context for theme management
- **Payments**: Stripe integration (placeholder keys included)
- **Database**: In-memory storage (production-ready for database integration)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ece-trading-platform/generated-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
# Edit .env.local with your actual API keys
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔐 Admin Access

**Demo Credentials:**
- Email: `admin@ece-cli.com`
- Password: `admin`

Access the admin panel by clicking "Admin" on the landing page.

## 📦 Environment Variables

Create a `.env.local` file with:

\`\`\`env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-secret

# Admin Configuration
ADMIN_EMAIL=admin@ece-cli.com
\`\`\`

## 🚀 Deployment

The platform is ready for deployment on any platform that supports Next.js.

## 📄 License

This project is licensed under the MIT License.
