// Main App Component - Navigation setup
import React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import FolderScreen from './src/screens/FolderScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import { colors } from './src/theme/colors';

export type RootStackParamList = {
  Home: undefined;
  Folder: { folder: any };
  Settings: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const theme: Theme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  },
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: colors.background },
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Folder"
              component={FolderScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{
                presentation: 'card',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
