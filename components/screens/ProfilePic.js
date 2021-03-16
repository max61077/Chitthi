import React, { useLayoutEffect } from 'react'
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

const ProfilePic = ({navigation, route}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.chatName,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'black'
            },
            headerTitleStyle: {color: 'whitesmoke', fontWeight: 'bold',  fontSize: 22},
            headerTintColor: 'whitesmoke',
        })
    })

    return (
        <View style={styles.container}>
            <Image
            style={styles.img}
            source={{uri: route.params.pic 
                || 
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXsZsyH1-UV3P-51B1Jtk0xVHkgzEc1isDIw&usqp=CAU'
            }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'black'
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        marginTop: '-15%'
    }
})

export default ProfilePic
