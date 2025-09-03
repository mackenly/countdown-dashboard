# Countdown Dashboard

> [!IMPORTANT]
> This project is a work in progress and primarily created to explore RedwoodSDK.

A beautiful, secure countdown dashboard application built with RedwoodSDK that helps you track work days until your target date with visual analytics and customizable work schedules.

## Features

- **🎯 Multiple Countdowns**: Create and manage multiple countdown timers
- **⏱️ Real-time Timers**: Live countdown showing days, hours, minutes, and seconds
- **📊 Visual Analytics**: Progress indicators, charts, and GitHub-style contribution grids
- **⚙️ Customizable Work Schedule**: Set which days you work (Monday-Friday, etc.)
- **🏖️ Time Off Management**: Add holidays, floating holidays, and PTO days
- **📅 Calendar Selection**: Easy date selection for target dates and holidays
- **🎨 Widget Customization**: Choose which widgets to display on your dashboard
- **🔐 Passkey Authentication**: Secure, passwordless authentication using WebAuthn
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices

## What It Does

This application helps you visualize and track the number of work days remaining until a specific date. Perfect for:

- Project deadlines
- Retirement countdowns
- Career milestones
- Personal goals
- Any important date you want to track

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run database migrations**:
   ```bash
   npm run migrate:dev
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:8787`

## How to Use

### For New Users (Not Logged In)
- Visit the home page to see what the application does
- Click "Sign In with Passkey" to create an account
- Use your device's biometric authentication or security key

### For Logged In Users
1. **Create Countdowns**:
   - Go to the Account page and click "Create Countdown"
   - Set your target date using the calendar
   - Choose which days you work (default: Monday-Friday)
   - Add holidays and set PTO days
   - Select which widgets to display on your dashboard

2. **Manage Countdowns**:
   - View all your countdowns on the Manage page
   - Edit existing countdowns to update settings
   - Delete countdowns you no longer need

3. **View Your Dashboard**:
   - Return to the home page to see your countdown visualizations
   - View the real-time countdown timer
   - Check your progress with charts and indicators
   - See your work schedule in a GitHub-style contribution grid

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run migrate:dev` - Run database migrations in development
- `npm run migrate:prd` - Run database migrations in production
- `npm run generate` - Generate Prisma client and types
- `npm run release` - Deploy to Cloudflare Workers

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── countdown/          # Countdown-specific components
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   ├── ContributionGrid.tsx
│   │   │   └── WidgetPreview.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   ├── pages/
│   │   ├── countdown/          # Countdown management
│   │   │   ├── ConfigPage.tsx
│   │   │   ├── CreatePage.tsx
│   │   │   ├── EditPage.tsx
│   │   │   ├── ManagePage.tsx
│   │   │   ├── functions.ts
│   │   │   └── routes.ts
│   │   ├── user/               # User authentication
│   │   │   ├── Login.tsx
│   │   │   ├── functions.ts
│   │   │   └── routes.ts
│   │   ├── Account.tsx         # User account page
│   │   ├── Home.tsx            # Main dashboard
│   │   └── Protected.tsx       # Protected area
│   ├── shared/
│   │   └── links.ts            # Shared navigation links
│   ├── lib/
│   │   └── utils.ts            # App-specific utilities
│   ├── Document.tsx            # HTML document template
│   ├── headers.ts              # HTTP headers configuration
│   └── styles.css              # Global styles
├── lib/
│   ├── countdown.ts            # Countdown calculation utilities
│   └── utils.ts                # General utilities
├── session/                    # Session management
│   ├── durableObject.ts
│   └── store.ts
├── scripts/
│   └── seed.ts                 # Database seeding script
├── client.tsx                  # Client-side entry point
├── db.ts                       # Database configuration
└── worker.tsx                  # Main worker entry point
```

## Database Schema

The application uses SQLite with Prisma ORM and Cloudflare D1. The database includes:

### **User Model**
- `id`: Unique user identifier (UUID)
- `username`: Unique username for the user
- `createdAt`: Account creation timestamp
- `credentials`: One-to-many relationship with Credential
- `countdowns`: One-to-many relationship with Countdown

### **Credential Model** (WebAuthn Authentication)
- `id`: Internal database ID (UUID)
- `userId`: Foreign key to User
- `credentialId`: WebAuthn credential identifier
- `publicKey`: Public key for authentication
- `counter`: Authentication counter
- `createdAt`: Credential creation timestamp

### **Countdown Model** (Multiple countdowns per user)
- `id`: Unique countdown identifier (UUID)
- `userId`: Foreign key to User
- `name`: User-defined countdown name
- `description`: Optional countdown description
- `targetDate`: Target date for the countdown
- `workDays`: JSON array of work days (0=Sunday, 1=Monday, etc.)
- `holidays`: JSON array of holiday dates
- `floatingHolidays`: Number of floating holidays available
- `ptoDays`: Number of PTO days available
- `enabledWidgets`: JSON array of enabled widget IDs
- `isActive`: Whether the countdown is currently active
- `createdAt`: Countdown creation timestamp
- `updatedAt`: Last modification timestamp

## Authentication

This application uses passkey authentication with WebAuthn. Users can sign in using:

- Biometric authentication (fingerprint, face ID)
- Hardware security keys
- Platform authenticators

No passwords required!

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run release
```

Make sure to set up your environment variables in the Cloudflare dashboard.

## Technology Stack

- **RedwoodSDK**: Modern web framework for Cloudflare Workers
- **React Server Components**: Server-side rendering with React
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: Database ORM
- **WebAuthn**: Passkey authentication
- **Cloudflare Workers**: Edge computing platform

## Learn More

- [RedwoodSDK Documentation](https://redwoodjs.com/docs)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [WebAuthn](https://webauthn.guide/)
- [Prisma](https://www.prisma.io/docs)