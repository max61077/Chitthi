import React, { useLayoutEffect } from 'react'
import {StyleSheet} from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import User from '../screens/User';


const Tab = createMaterialTopTabNavigator();

const TabNav = ({navigation}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add A New Chat',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0
            },
            headerTitleStyle: {color: '#2196F3', fontWeight: 'bold',  fontSize: 22},
            headerTintColor: '#2196F3',
        })
    }, [navigation])


    return (
        <Tab.Navigator 
        style={styles.tab}
        tabBarOptions={{
            activeTintColor: '#2196F3',
            style: {
            backgroundColor: 'white',
            },
            indicatorStyle: {
            height: 0
            },
            labelStyle: {
            fontWeight: 'bold'
            },
            showIcon: true,
        }}
        >
            <Tab.Screen name="Users" component={User} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tab: {
      tintColor: 'white'
    }
  });

export default TabNav
