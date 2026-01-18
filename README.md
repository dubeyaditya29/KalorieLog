# BiteLog - Calorie Tracking App

A React Native mobile application for tracking calories using AI-powered food image analysis.

## 📁 Project Structure

```
biteLog/
├── App.js                    # Main application entry point
├── babel.config.js           # Babel configuration
├── package.json              # Dependencies and scripts
├── app.json                  # Expo configuration
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── index.js          # Barrel export for components
│   │   ├── common/           # Shared components
│   │   │   └── CircularProgress.js
│   │   ├── home/             # Home screen specific components
│   │   │   ├── CalorieCounter.js
│   │   │   ├── MacroRings.js
│   │   │   └── MacronutrientBar.js
│   │   └── meal/             # Meal-related components
│   │       └── MealCard.js
│   │
│   ├── screens/              # App screens
│   │   ├── index.js          # Barrel export for screens
│   │   ├── auth/             # Authentication screens
│   │   │   ├── LoginScreen.js
│   │   │   ├── OnboardingScreen.js
│   │   │   └── VerifyEmailScreen.js
│   │   ├── home/             # Home screen
│   │   │   └── HomeScreen.js
│   │   ├── meal/             # Meal-related screens
│   │   │   └── AddMealScreen.js
│   │   └── profile/          # Profile screen
│   │       └── ProfileScreen.js
│   │
│   ├── services/             # Business logic and API services
│   │   ├── index.js          # Barrel export for services
│   │   ├── api/              # External API integrations
│   │   │   ├── supabase.js   # Supabase client
│   │   │   ├── authService.js
│   │   │   ├── geminiService.js
│   │   │   ├── mealService.js
│   │   │   └── profileService.js
│   │   └── storageService.js # Local storage utilities
│   │
│   ├── contexts/             # React Context providers
│   │   └── AuthContext.js
│   │
│   ├── styles/               # Global styles and theming
│   │   ├── theme.js          # Color palette, spacing, fonts
│   │   └── globalStyles.js   # Common button styles, etc.
│   │
│   ├── utils/                # Utility functions
│   │   └── bmiCalculator.js
│   │
│   ├── hooks/                # Custom React hooks (future)
│   │
│   └── constants/            # App constants (future)
│
└── supabase_*.sql            # Database migration scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start --clear
```

### Environment Variables

Create a `.env` file with:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## 🏗️ Architecture

### Folder Guidelines

- **components/**: Reusable UI components. Organize by feature (home, meal) or type (common).
- **screens/**: Full-page components that represent app screens. One export per screen.
- **services/**: All business logic, API calls, and data manipulation.
- **contexts/**: React Context providers for global state.
- **styles/**: Theming and global styles only. Component-specific styles stay in components.
- **utils/**: Pure utility functions with no side effects.
- **hooks/**: Custom React hooks (useAuth, useMeals, etc.).

### Naming Conventions

- Components: PascalCase, e.g., `MealCard.js`
- Services: camelCase, e.g., `mealService.js`
- Screens: PascalCase + Screen suffix, e.g., `HomeScreen.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the folder structure guidelines
4. Write clean, documented code
5. Submit a pull request

## 📱 Features

- 📸 AI-powered food image analysis using Google Gemini
- 📊 Calorie and macronutrient tracking
- 🎯 Daily calorie goals based on BMI
- 👤 User profiles with health metrics
- 🔐 Secure authentication with Supabase

## 📄 License

MIT License
