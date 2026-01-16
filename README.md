# BiteLog 🍽️

A mobile calorie counter app that uses AI to analyze food photos and track your daily calorie intake.

## Features

- 📸 **Photo-based Calorie Tracking**: Take photos of your meals and get instant calorie estimates
- 🤖 **AI-Powered Analysis**: Uses Google's Gemini Vision API to identify food items and estimate calories
- 🍳 **Meal Categories**: Track breakfast, lunch, dinner, and snacks separately
- 📊 **Daily Summary**: View your total calories and breakdown by meal type
- 💾 **Local Storage**: All data stays private on your device
- 🎨 **Beautiful UI**: Modern, intuitive interface with color-coded meal types

## Tech Stack

- **Framework**: React Native with Expo
- **AI**: Google Gemini Vision API
- **Storage**: AsyncStorage (local device storage)
- **Navigation**: React Navigation
- **Camera**: Expo Camera & Image Picker

## Prerequisites

- Node.js (v20.16.0 or higher recommended)
- npm or yarn
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file has already been created with your API key. If you need to change it:

```bash
# Edit .env file
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Important**: Never commit the `.env` file to version control!

### 3. Start the Development Server

```bash
npx expo start
```

This will start the Metro bundler and show a QR code in your terminal.

### 4. Run on Your Phone

1. Open the **Expo Go** app on your phone
2. Scan the QR code from your terminal
3. The app will load on your device

**Note**: Make sure your phone and computer are on the same Wi-Fi network.

## How to Use

1. **Launch the app** - You'll see the home screen with your daily calorie summary
2. **Add a meal** - Tap one of the meal type buttons (Breakfast, Lunch, Dinner, or Snack)
3. **Take a photo** - Use your camera or select from gallery
4. **Analyze** - Tap "Analyze Food" to let AI identify the food and estimate calories
5. **Save** - Review the results and tap "Save Meal" to log it
6. **Track progress** - Return to home screen to see your updated daily total

## Project Structure

```
biteLog/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CalorieCounter.js
│   │   └── MealCard.js
│   ├── screens/           # App screens
│   │   ├── HomeScreen.js
│   │   └── AddMealScreen.js
│   ├── services/          # Business logic
│   │   ├── geminiService.js
│   │   └── storageService.js
│   └── styles/            # Theme and styles
│       ├── theme.js
│       └── globalStyles.js
├── App.js                 # Main app entry point
├── .env                   # Environment variables (DO NOT COMMIT)
└── package.json
```

## API Key Security

⚠️ **Important Security Notes**:

- Your API key is stored in `.env` which is gitignored
- Never commit `.env` to version control
- Don't share your repository publicly with the API key exposed
- For production, consider using a backend proxy to hide the API key

## Troubleshooting

### Camera not working
- Make sure you granted camera permissions when prompted
- On iOS, check Settings > BiteLog > Camera
- On Android, check App Settings > Permissions > Camera

### API errors
- Verify your Gemini API key is correct in `.env`
- Check your internet connection
- Make sure the API key has not exceeded its quota

### App won't load
- Make sure your phone and computer are on the same Wi-Fi
- Try restarting the Expo dev server
- Clear Expo cache: `npx expo start -c`

## Future Enhancements

- 📈 Weekly/monthly calorie trends
- 🎯 Custom calorie goals
- ☁️ Cloud sync across devices
- 🏃 Exercise tracking
- 📱 Widget support
- 🌙 Dark mode

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React Native and Google Gemini AI
