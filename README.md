# KalorieLog - AI-Powered Calorie Tracking App

A React Native mobile application for tracking calories and macronutrients using AI-powered food image analysis with Google Gemini.

## ✨ Features

- 📸 **AI-Powered Food Analysis** - Take a photo of your food and let Google Gemini analyze calories, protein, carbs, and fat
- 📊 **Macronutrient Tracking** - Visual circular progress rings for protein, carbs, and fat
- 📅 **7-Day History** - View and browse your meal history for the last 7 days
- 🎯 **Daily Calorie Goals** - Personalized goals based on your BMI and activity level
- 👤 **User Profiles** - Track your health metrics (age, height, weight)
- 🔐 **Secure Authentication** - Powered by Supabase with email/password login
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
│   ├── supabase_schema.sql
│   ├── supabase_create_meals.sql
│   └── supabase_add_macros.sql
│
├── src/
│   ├── ui/                   # UI Layer (Visual components)
│   │   ├── assets/           # Icons and images
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # App screens
│   │   └── styles/           # Theming and global styles
│   │
│   └── logic/                # Logic Layer (Business logic & Data)
│       ├── services/         # API & Storage services
│       ├── contexts/         # React Context providers (Auth)
│       ├── utils/            # Utility functions (BMI, etc.)
│       ├── hooks/            # Custom React hooks
│       └── constants/        # App-wide constants
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
git clone https://github.com/your-username/kalorielog.git
cd kalorielog

# Install dependencies
npm install

# Start the development server
npx expo start --clear
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Supabase Setup

Run the SQL migration files in your Supabase SQL editor:
1. `database/supabase_schema.sql` - Creates profiles table
2. `database/supabase_create_meals.sql` - Creates meals table
3. `database/supabase_add_macros.sql` - Adds macronutrient columns

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo |
| Navigation | React Navigation (Bottom Tabs + Stack) |
| Backend | Supabase (PostgreSQL) |
| AI/ML | Google Gemini API |
| Auth | Supabase Auth |
| Styling | StyleSheet (dark theme) |

### Folder Guidelines

- **assets/**: Custom icons and images with barrel exports
- **components/**: Reusable UI components organized by feature
- **screens/**: Full-page components representing app screens
- **services/**: All business logic, API calls, and data manipulation
- **contexts/**: React Context providers for global state
- **styles/**: Theming and global styles only
- **utils/**: Pure utility functions with no side effects

### Naming Conventions

- Components: PascalCase, e.g., `MealCard.js`
- Services: camelCase, e.g., `mealService.js`
- Screens: PascalCase + Screen suffix, e.g., `HomeScreen.js`
- Icons: lowercase with underscores, e.g., `breakfast.png`

## 📱 App Flow

1. **Login/Register** → Users authenticate with email and password
2. **Onboarding** → First-time users complete their profile (name, age, height, weight)
3. **Home Screen** → View daily progress, macros, and meal history
4. **Add Meal** → Take photo or select from gallery → AI analyzes → Review → Save
5. **Profile** → View/edit user settings and health metrics

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#1C1C1E` | Main dark background |
| Primary | `#0A84FF` | Blue accent, buttons |
| Breakfast | `#5E5CE6` | Indigo |
| Lunch | `#0A84FF` | Blue |
| Dinner | `#BF5AF2` | Purple |
| Snack | `#FF6B6B` | Coral |

### Icons

All icons are custom PNG files with white `tintColor` applied for dark theme visibility.

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
