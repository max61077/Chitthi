import { StatusBar } from 'expo-status-bar';
import React, {useReducer} from 'react';
import {LogBox} from 'react-native'
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native';
import {initialState, reducer} from './components/Reducer/Reducer';

import Home from './components/screens/Home';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen'
import Chat from './components/screens/Chat'
import Splash from './components/screens/Splash';
import TabNav from './components/Tabs/TabNav'
import EditPic from './components/screens/EditPic';
import ProfilePic from './components/screens/ProfilePic';
import {GlobalStore} from './components/GlobalStore/Store'

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: {
    height: 85,    
    backgroundColor: '#2196F3',
  },
  headerTitleStyle: {color: 'whitesmoke', fontWeight: 'bold',  fontSize: 22},
  headerTintColor: 'whitesmoke',
}

LogBox.ignoreAllLogs();

export default function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
   <GlobalStore.Provider value={{state, dispatch}}>
      <StatusBar style="light"/>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={globalScreenOptions}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            title: 'Chitthi'
          }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="TabNav" component={TabNav} />
          <Stack.Screen name="Pic" component={EditPic} />
          <Stack.Screen name="ProfilePic" component={ProfilePic} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalStore.Provider>
  )
}
