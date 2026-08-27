import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/logic/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/ui/styles/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoginScreen } from './src/ui/screens/auth/LoginScreen';
import { WelcomeScreen } from './src/ui/screens/welcome/WelcomeScreen';
import { NutritionScreen } from './src/ui/screens/nutrition/NutritionScreen';
import { ChatScreen } from './src/ui/screens/chat/ChatScreen';
import { ProfileScreen } from './src/ui/screens/profile/ProfileScreen';
import { EditProfileScreen } from './src/ui/screens/profile/EditProfileScreen';
import { AddMealScreen } from './src/ui/screens/meal/AddMealScreen';

import { ModalProvider } from './src/ui/components/common/ThemedModal';
import { NutritionIcon, ChatIcon, ProfileIcon } from './src/ui/components/icons';
import { BrandMark } from './src/ui/components/common/ScreenHeader';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ONBOARDING_KEY = '@kyra_welcome_seen';

const TabIcon = ({ focused, Icon, theme }) => (
  <View style={[styles.tabIconWrap, focused && { backgroundColor: theme.colors.primarySoft }]}>
    <Icon size={19} color={focused ? theme.colors.primary : theme.colors.textTertiary} strokeWidth={focused ? 2 : 1.8} />
  </View>
);

function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: theme.fontWeight.bold,
        },
        headerTitleAlign: 'center',
        headerTitle: () => <BrandMark size={28} />,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 6,
          height: 68,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.semibold,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Kyra',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={ChatIcon} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarLabel: 'Nutrition',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={NutritionIcon} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={ProfileIcon} theme={theme} />,
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, loading } = useAuth();
  const { theme, isDark } = useTheme();
  const [welcomeSeen, setWelcomeSeen] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => setWelcomeSeen(value === 'true'))
      .catch(() => setWelcomeSeen(true));
  }, []);

  const handleWelcomeFinish = () => {
    setWelcomeSeen(true);
    AsyncStorage.setItem(ONBOARDING_KEY, 'true').catch(() => {});
  };

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  if (loading || welcomeSeen === null) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {!user ? (
          !welcomeSeen ? (
            <Stack.Screen name="Welcome">
              {() => <WelcomeScreen onFinish={handleWelcomeFinish} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
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

function ThemedRoot() {
  const { isDark } = useTheme();
  return (
    <AuthProvider>
      <ModalProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Navigation />
      </ModalProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedRoot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconWrap: {
    width: 44,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
