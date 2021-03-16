import { auth } from '../Firebase';
import React, { useEffect, useState, useLayoutEffect, useContext} from 'react'
import {Text, View, TouchableWithoutFeedback, Keyboard, ToastAndroid, ActivityIndicator, StyleSheet} from 'react-native'
import {Button, Input} from 'react-native-elements'
import { GlobalStore } from '../GlobalStore/Store';

const LoginScreen = ({navigation}) => {
    const {state, dispatch} = useContext(GlobalStore)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [logo, setLogo] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chitthi',
            headerTitleAlign: 'center',
            headerTitleStyle: {color: 'whitesmoke', fontWeight: 'bold',  fontSize: 22},
            headerTintColor: 'whitesmoke',
    })}, [])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if(authUser){
                navigation.replace('Home')
            }
        })
        return unsubscribe;
    }, [])

    const handleFocus = () => {

        setTimeout(() => {
            setLogo(false)
        }, 20);
    }
    const handleBlur = () => {

        setTimeout(() => {
            setLogo(true)
        }, 20);
    }

    const signIn = () => {
        dispatch({type: "START_LOADING"});
        auth.signInWithEmailAndPassword(email, password)
        .then(() =>  dispatch({type: "STOP_LOADING"}))
        .catch(err =>{
            dispatch({type: "STOP_LOADING"})
            ToastAndroid.show(err.message, ToastAndroid.SHORT)
        })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {
                state.loader
                ?
                <View style={styles.screen}>
                    <ActivityIndicator
                    size="large"
                    color="#2196F3"
                    />
                </View>

                :
                <View style={styles.screen}>
                    {
                        logo && <View style={styles.logo}>
                                    <View style={styles.icon}>
                                        <Text style={styles.text}>C</Text>
                                    </View>
                                </View>
                    }
                    <View style={styles.inp}>
                        <Input 
                        placeholder="Email" 
                        type="email" 
                        value={email}
                        onChangeText={text => setEmail(text)}
                        onFocus={() => handleFocus()}
                        onBlur={() => handleBlur()}
                        />

                        <Input 
                        placeholder="Password" 
                        secureTextEntry 
                        value={password}
                        onChangeText={text => setPassword(text)}
                        onSubmitEditing={signIn}
                        onFocus={() => handleFocus()}
                        onBlur={() => handleBlur()}
                        />
                    </View>
                    <View style={styles.btn} >
                        <Button raised onPress={signIn} title="Login"/>
                        <View style={{height:20}}/>
                        <Button raised onPress={() => navigation.navigate("Register")} type="outline" title="Register"/>
                    </View>
                </View>
            }
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: '100%',
        height: '22%',
        alignItems: 'center',
    },
    icon: {
        width: '40%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        borderRadius: 20
    },
    text: {
        color: 'whitesmoke',
        fontSize: 100,
        fontWeight: 'bold'
    },
    inp: {
        width: 300,
        marginTop: '15%'
    },
    btn: {
        width: 200,
        marginTop: 10,
    }
})

export default LoginScreen
