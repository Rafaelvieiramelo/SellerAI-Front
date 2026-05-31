import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StyleSheet, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useAuth } from '../contexts/AuthContext';
import ProductAdGeneratorScreen from '../features/product-ad-generator/screens/ProductAdGeneratorScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token } = useAuth();

  return (
    <View style={styles.navigationRoot}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: styles.card,
          }}
        >
          {token ? (
            <Stack.Screen name="Home" component={ProductAdGeneratorScreen} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  navigationRoot: {
    flex: 1,
    minHeight: 0,
    ...Platform.select({
      web: {
        minHeight: '100%',
        backgroundColor: '#07111f',
      },
      default: null,
    }),
  },
  card: {
    flex: 1,
    backgroundColor: '#07111f',
  },
});
