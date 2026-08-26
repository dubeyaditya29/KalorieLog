import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/logic/contexts/AuthContext';
import { theme } from './src/ui/styles/theme';

// Screens
import { LoginScreen } from './src/ui/screens/auth/LoginScreen';
import { WelcomeScreen } from './src/ui/screens/welcome/WelcomeScreen';
import { NutritionScreen } from './src/ui/screens/nutrition/NutritionScreen';
import { ChatScreen } from './src/ui/screens/chat/ChatScreen';
import { ProfileScreen } from './src/ui/screens/profile/ProfileScreen';
import { EditProfileScreen } from './src/ui/screens/profile/EditProfileScreen';
import { AddMealScreen } from './src/ui/screens/meal/AddMealScreen';

// Modal Provider
import { ModalProvider } from './src/ui/components/common/ThemedModal';
import { NutritionIcon, ChatIcon, ProfileIcon } from './src/ui/components/icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ONBOARDING_KEY = '@kyra_welcome_seen';

const TabIcon = ({ focused, Icon }) => (
  <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
    <Icon size={19} color={focused ? theme.colors.primary : theme.colors.textTertiary} strokeWidth={focused ? 2 : 1.8} />
  </View>
);

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
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
          title: 'Assistant',
          tabBarLabel: 'Assistant',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={ChatIcon} />,
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          title: 'Kyra',
          tabBarLabel: 'Nutrition',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={NutritionIcon} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={ProfileIcon} />,
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, loading } = useAuth();
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

  if (loading || welcomeSeen === null) {
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

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <StatusBar style="dark" />
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
  tabIconWrap: {
    width: 44,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: theme.colors.primarySoft,
  },
});
