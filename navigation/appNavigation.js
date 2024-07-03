import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { NavigationContainer} from '@react-navigation/native'
import Home from '../screens/Home'
import Login from '../screens/Login'
import Account from '../screens/Account'
import AddMotel from '../screens/AddMotel'

const Stack = createNativeStackNavigator();
export default function AppNavigation() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" options={{headerShown: false}} component={Home} /> 
      <Stack.Screen name="Login" options={{headerShown: false}} component={Login} /> 
      <Stack.Screen name="Account" options={{headerShown: false}} component={Account} /> 
      <Stack.Screen name="AddMotel" options={{headerShown: false}} component={AddMotel} /> 
    </Stack.Navigator>
  </NavigationContainer>
  )
}