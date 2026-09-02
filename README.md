# Kyra — Your Personal Health Companion

A React Native mobile application for tracking calories and macronutrients using AI-powered food image analysis with Google Gemini, plus a personal AI nutrition assistant.

## ✨ Features

- 📸 **AI-Powered Food Analysis** - Take a photo of your food and let Google Gemini analyze calories, protein, carbs, and fat
- 📊 **Macronutrient Tracking** - Visual circular progress rings for protein, carbs, and fat
- 📅 **7-Day History** - View and browse your meal history for the last 7 days
- 🎯 **Daily Calorie Goals** - Personalized goals based on your BMI and activity level
- 👤 **User Profiles** - Track your health metrics (age, height, weight)
- 🔐 **Secure Authentication** - Email/password login with password reset and account recovery
- 📱 **Phone Recovery** - Forgot your email? Recover it using your phone number
- 🎨 **Themed Dialogs** - Beautiful dark-themed modal dialogs throughout the app
- 🌙 **Beautiful Dark Theme** - Premium dark UI with modern design

## 📁 Project Structure

```
kalorieLog/
├── App.js                    # Main application entry point
├── package.json              # Dependencies and scripts
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
│
├── database/                 # SQL migration & schema scripts
│   ├── supabase_schema.sql           # Creates profiles table
│   ├── supabase_create_meals.sql     # Creates meals table
│   ├── supabase_add_macros.sql       # Adds macronutrient columns
│   ├── supabase_add_phone.sql        # Adds phone_number column + forgot email function
│   └── supabase_add_email_verified.sql # Adds email verification tracking
│
├── src/
│   ├── ui/                   # UI Layer (Visual components)
│   │   ├── assets/           # Icons and images
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Shared components (ThemedModal, etc.)
│   │   │   ├── home/         # Home screen components
│   │   │   └── meal/         # Meal-related components
│   │   ├── screens/          # App screens
│   │   │   ├── auth/         # Login, Onboarding, etc.
│   │   │   ├── home/         # Home/Dashboard
│   │   │   ├── meal/         # Add/Edit meal
│   │   │   └── profile/      # User profile
│   │   └── styles/           # Theming and global styles
│   │
│   └── logic/                # Logic Layer (Business logic & Data)
│       ├── services/         # API & Storage services
│       │   └── api/          # Supabase, Gemini, Auth services
│       ├── contexts/         # React Context providers (Auth)
│       ├── utils/            # Utility functions (BMI, etc.)
│       ├── hooks/            # Custom React hooks
│       └── constants/        # App-wide constants & messages
```


## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device
- Supabase account (for database)
- Google AI Studio account (for Gemini API key)

### Installation

```bash
# Clone the repository
git clone https://github.com/dubeyaditya29/KalorieLog.git
cd KalorieLog

# Install dependencies
npm install

# Start the development server
npx expo start --clear
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_GEMINI_API_KEY=your_gemini_api_key
```

### Supabase Setup

Run the SQL migration files in your Supabase SQL editor (in order):

1. `database/supabase_schema.sql` - Creates profiles table with RLS policies
2. `database/supabase_create_meals.sql` - Creates meals table
3. `database/supabase_add_macros.sql` - Adds macronutrient columns (protein, carbs, fat)
4. `database/supabase_add_phone.sql` - Adds phone_number column + forgot email lookup function
5. `database/supabase_add_email_verified.sql` - Adds email_verified column with auto-sync trigger

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo |
| Navigation | React Navigation (Bottom Tabs + Stack) |
| Backend | Supabase (PostgreSQL) |
| AI/ML | Google Gemini API |
| Auth | Supabase Auth (Email/Password) |
| Styling | StyleSheet (dark theme) |

### Authentication Flow

| Flow | Description |
|------|-------------|
| **Sign Up** | Email + Password → Profile creation → Home |
| **Sign In** | Email + Password → Home |
| **Forgot Password** | Enter email → Receive reset link (via Supabase) |
| **Forgot Email** | Enter phone number → View associated email |

### Folder Guidelines

- **assets/**: Custom icons and images with barrel exports
- **components/common/**: Shared UI components (ThemedModal, etc.)
- **components/**: Feature-specific reusable UI components
- **screens/**: Full-page components representing app screens
- **services/api/**: All API calls (Supabase, Gemini, Auth)
- **contexts/**: React Context providers for global state
- **styles/**: Theming and global styles only
- **utils/**: Pure utility functions with no side effects
- **constants/**: Centralized messages and configuration

### Naming Conventions

- Components: PascalCase, e.g., `MealCard.js`
- Services: camelCase, e.g., `authService.js`
- Screens: PascalCase + Screen suffix, e.g., `HomeScreen.js`
- Icons: lowercase with underscores, e.g., `breakfast.png`

## 📱 App Flow

1. **Login/Register** → Users authenticate with email and password
2. **Onboarding** → First-time users complete their profile (name, phone, age, height, weight)
3. **Home Screen** → View daily progress, macros, and meal history
4. **Add Meal** → Take photo or select from gallery → AI analyzes → Review → Save
5. **Profile** → View/edit user settings, health metrics, and sign out

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#1C1C1E` | Main dark background |
| Primary | `#0A84FF` | Blue accent, buttons |
| Success | `#30D158` | Green, success states |
| Error | `#FF453A` | Red, destructive actions |
| Breakfast | `#5E5CE6` | Indigo |
| Lunch | `#0A84FF` | Blue |
| Dinner | `#BF5AF2` | Purple |
| Snack | `#FF6B6B` | Coral |

### Themed Modals

All dialogs use the `ThemedModal` component for consistent dark-themed UI:

```javascript
import { useModal } from '../components/common/ThemedModal';

const { showAlert, showConfirm, showDestructive } = useModal();

// Simple alert
showAlert('Title', 'Message');

// Confirmation dialog
showConfirm('Title', 'Are you sure?', onConfirm);

// Destructive action (red button)
showDestructive('Delete', 'Are you sure?', 'Delete', onDelete);
```

### Icons

All icons are custom PNG files with white `tintColor` applied for dark theme visibility.

## 🔒 Security

- **SQL Injection Protection**: All queries use parameterized statements via Supabase client
- **Row Level Security (RLS)**: Users can only access their own data
- **Input Validation**: Client-side and server-side validation on all inputs
- **Secure Functions**: `SECURITY DEFINER` functions for controlled data access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the folder structure guidelines
4. Write clean, documented code
5. Submit a pull request

## 📄 License

MIT License

## 👏 Acknowledgments

- [Expo](https://expo.dev/) - React Native framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Google Gemini](https://ai.google.dev/) - AI food analysis
- [React Navigation](https://reactnavigation.org/) - Navigation library
