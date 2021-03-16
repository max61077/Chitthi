import React, { useEffect, useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { auth } from '../Firebase';

const Splash = ({navigation}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerTitleAlign: 'center',
            headerStyle: {
                height: 0,    
                backgroundColor: 'white',
            },
    })}, [])

    useEffect(() => {
        const redirect = setTimeout(() => {
            const unsubscribe = auth.onAuthStateChanged(authUser => {
                if(authUser){
                    navigation.replace('Home')
                } else
                    navigation.replace('Login')
            })
            return unsubscribe;
        }, 2000);

        return () => clearTimeout(redirect);

    }, [navigation])

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.header}>Chitthi</Text>
                <View style={styles.icon}>
                    <Text style={styles.text}>C</Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        
    },
    header: {
        color: '#2196F3',
        top: '-15%',
        fontSize: 50,
        fontWeight: 'bold'
    },
    icon: {
        width: '40%',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        borderRadius: 20
    },
    text: {
        color: 'whitesmoke',
        fontSize: 100,
        fontWeight: 'bold'
    }
})

export default Splash
