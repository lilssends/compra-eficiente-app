import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar, ActivityIndicator, View, StyleSheet} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import MarketsScreen from './src/screens/MarketsScreen';
import PurchasesScreen from './src/screens/PurchasesScreen';
import CommunityScreen from './src/screens/CommunityScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2ECC71',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#ECF0F1',
          paddingBottom: 5,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Inicio', tabBarLabel: 'Inicio'}}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{title: 'Scanner', tabBarLabel: 'Scanner'}}
      />
      <Tab.Screen
        name="Markets"
        component={MarketsScreen}
        options={{title: 'Mercados', tabBarLabel: 'Mercados'}}
      />
      <Tab.Screen
        name="Purchases"
        component={PurchasesScreen}
        options={{title: 'Compras', tabBarLabel: 'Compras'}}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{title: 'Comunidade', tabBarLabel: 'Comunidade'}}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('@compra_eficiente_token', token);
        setUserLoggedIn(true);
      } else {
        await AsyncStorage.removeItem('@compra_eficiente_token');
        setUserLoggedIn(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {userLoggedIn ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default App;
