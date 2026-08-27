# AGENTS.md — KalorieLog

Guidance for AI agents (and humans) working on this repository.

## Project Overview

**Kyra** (npm name: `kyra`, formerly KalorieLog) — *"your personal health companion."* An AI-powered calorie & macronutrient tracking app for iOS/Android built with React Native + Expo. Users photograph their food, Google Gemini estimates calories/macros, meals are stored in Supabase (PostgreSQL), and **Kyra**, the Gemini-powered in-chat assistant, answers nutrition questions.

**Design language**: clean white + blue light theme (`theme.js` is the single source of truth — never hardcode colors).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | React Navigation v7 (`bottom-tabs` + `native-stack`) |
| Backend | Supabase (Postgres + Auth + RLS) |
| AI | Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` |
| State | React Context (`AuthContext`) + local component state |
| Language | JavaScript (no TypeScript) |

## Commands

```bash
npm install                  # install dependencies
npx expo start --clear       # dev server (use --clear after dep changes)
npx expo start --ios         # run on iOS simulator
npx expo start --android     # run on Android emulator
npx expo export --platform ios --output-dir /tmp/kalorie-export   # bundle smoke-test (no device needed)
npm test                     # run all Jest tests
npx jest bmiCalculator       # run a single suite by name substring
```

Tests use `jest` + `jest-expo` (config in `package.json`). One suite per feature under `src/**/__tests__/`; Supabase/Gemini/FileSystem are mocked — no network or `.env` needed to run them. There is **no linter configured**; minimum manual verification: `npm test`, then the `expo export` command above (catches import/syntax errors), then run the app in a simulator.

## Environment Setup

Create `.env` in root (gitignored; see `.env.example`):

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_GEMINI_API_KEY=...
```

Note: `supabase.js` throws at import time if the Supabase vars are missing.

Database migrations live in `database/` and must be run manually in the Supabase SQL editor **in filename order** (schema → create_meals → add_macros → add_phone → add_email_verified → **add_preferences** → **add_accounts**: moves email/phone_number/email_verified out of profiles into a new `accounts` table; signup trigger now creates both rows → **add_is_pro**: `accounts.is_monthly_pro` / `is_yearly_pro` flags for future pro customers). Tables use Row Level Security keyed on `auth.uid()`.

## Architecture

Strict two-layer split under `src/`:

```
src/
├── ui/          # ALL React components, styles, assets
│   ├── screens/
│   │   ├── auth/LoginScreen.js       # sign in / sign up / forgot password / forgot email
│   │   ├── nutrition/NutritionScreen # setup form (unit toggles) OR daily dashboard
│   │   ├── chat/ChatScreen.js        # Gemini nutrition assistant
│   │   ├── meal/AddMealScreen.js     # capture → analyzing → review flow
│   │   └── profile/ProfileScreen.js  # edit profile, sign out
│   ├── components/
│   │   ├── common/    # ThemedModal, CircularProgress, AnalysisLoader, UnitField
│   │   └── meal/      # MealCard
│   ├── styles/        # theme.js (colors/spacing/fonts), globalStyles.js
│   └── assets/        # custom PNG icons, barrel-exported from index.js
└── logic/         # NO JSX here
    ├── services/api/   # supabase.js, authService.js, profileService.js,
    │                   # mealService.js, geminiService.js (+ chatWithNutritionist)
    ├── services/storageService.js  # facade over mealService (snake_case ↔ camelCase)
    ├── contexts/AuthContext.js     # session state + refreshProfile()
    ├── utils/bmiCalculator.js      # BMI/BMR/calorie goal (pure)
    ├── utils/macroGoals.js         # BMI-based daily protein/carb/fat targets (pure)
    └── constants/messages.js
```

### Navigation flow (`App.js`)

Conditional stack rendering driven by `useAuth()` + a persisted `@kalorielog_welcome_seen` AsyncStorage flag:
1. Not logged in, welcome not seen → `WelcomeScreen` (3-slide product tour; "Get Started"/Skip persists the flag)
2. Not logged in, welcome seen → `LoginScreen`
3. Logged in → `MainTabs` with **Assistant (Chat) as the default tab**, then Nutrition, Profile — plus `AddMeal` as a modal stack screen

Onboarding of health data lives inside the Nutrition tab: if the profile lacks name/age/height_cm/weight_kg, `NutritionScreen` renders its health-details form instead of the dashboard. Call `refreshProfile()` from `useAuth()` after saving the profile so other tabs re-read it.

### Icon system

All UI icons are hand-drawn stroke SVGs in `src/ui/components/icons/index.js` (24px grid, 1.8 stroke, rounded caps) — do not introduce emoji or new PNG icons for UI. Product-tour illustrations live in `src/ui/components/illustrations/index.js`. Only brand asset kept as PNG is `src/ui/assets/icons/logo.png`.

### Key flows

- **Nutrition setup**: form collects age, gender, activity level, height (cm/in toggle), weight (kg/lb toggle via `UnitField`). Canonical values stored in metric (cm/kg). Live "daily target" preview appears once age+height+weight are filled.
- **Add meal**: `capture` stage (Open Camera / Gallery, meal-type chips) → photo triggers automatic analysis with round `AnalysisLoader` animation → `review` stage shows editable calorie/protein/carbs/fat inputs, description, items, a suggestion strip ("still Xg protein short of your target"), then saves via `storageService.saveMeal`.
- **Macro suggestions** (`macroGoals.getMacroSuggestions`): protein g/kg by BMI category (1.6 underweight → 1.2 obese), ±300–500 kcal adjustment vs maintenance by category, fat = 27.5% of calories, carbs fill the remainder.
- **Chat**: `chatWithNutritionist(history, profile)` sends prior turns + profile context as system instruction. History is session-only (not persisted).

### Data flow

- Screens never call Supabase directly; they go through `storageService.js` (meals) or `profileService.js`/`authService.js`.
- Meal records: DB snake_case (`protein_g`, `logged_at`, `meal_type`) ↔ app camelCase (`protein`, `timestamp`, `mealType`). Mapping happens in `storageService.js`.
- Gemini food analysis returns JSON (sometimes markdown-fenced) — parsing is in `geminiService.js`.

## Conventions

- **Components**: PascalCase files (`MealCard.js`), named exports (`export const NutritionScreen = ...`)
- **Services/utils**: camelCase files (`authService.js`, `macroGoals.js`)
- **Screens**: PascalCase + `Screen` suffix
- **Theming**: only theme tokens (`theme.colors.*`) — includes `amber` for carbs accents; meal-type colors via `getMealTypeColor()`
- **Dialogs**: always `useModal()` from `ThemedModal` (`showAlert`, `showConfirm`, `showDestructive`)
- **Layer rule**: `logic/` contains no UI imports; `ui/` may import from `logic/`

## Known Issues / Gotchas

1. `storageService.clearAllMeals()` only clears a legacy AsyncStorage key — meals are cloud-only now; the function is effectively dead.
2. Some legacy `console.log`s remain in services.
3. Default calorie fallback of 2300 appears in a few places if suggestions can't be computed.
4. Chat history resets when the app restarts or user navigates away (session-only by design for now).
5. No offline support — Supabase/Gemini connectivity required.

## Git Notes

Remote: `https://github.com/dubeyaditya29/KalorieLog.git` (repo was renamed from `biteLog`). App identity: bundle/package `com.kyra.app`, EAS project in `app.json` (owner `adityadubey29`) with `eas.json` for APK builds. Note: changing the bundle identifier means previously installed dev builds won't receive updates — reinstall required.
