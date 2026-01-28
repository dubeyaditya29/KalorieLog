import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import { AuthProvider, useAuth } from './src/logic/contexts/AuthContext';
import { theme } from './src/ui/styles/theme';

// Auth Screens
import { LoginScreen } from './src/ui/screens/auth/LoginScreen';
import { OnboardingScreen } from './src/ui/screens/auth/OnboardingScreen';

// Main Screens
import { HomeScreen } from './src/ui/screens/home/HomeScreen';
import { AddMealScreen } from './src/ui/screens/meal/AddMealScreen';
import { ProfileScreen } from './src/ui/screens/profile/ProfileScreen';

// Services
import { hasCompletedProfile } from './src/logic/services/api/profileService';

// Modal Provider
import { ModalProvider } from './src/ui/components/common/ThemedModal';

// Icons
import { homeIcon, profileIcon } from './src/ui/assets';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for main app (replaces Drawer - no reanimated needed!)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.fontWeight.bold,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.medium,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'KalorieLog',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={homeIcon}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={profileIcon}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, loading, profileVersion } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        console.log('Checking profile for user:', user.id, 'version:', profileVersion);
        const isComplete = await hasCompletedProfile(user.id);
        console.log('Profile complete:', isComplete);
        setProfileComplete(isComplete);
      } else {
        console.log('No user, skipping profile check');
        setProfileComplete(false);
      }
      setCheckingProfile(false);
    };

    if (!loading) {
      setCheckingProfile(true);
      checkProfile();
    }
  }, [user, loading, profileVersion]);

  if (loading || checkingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          // Auth Stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !profileComplete ? (
          // Onboarding Stack
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          // Main App Stack with Bottom Tabs
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="AddMeal"
              component={AddMealScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Navigation />
      </ModalProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
