import React, { useContext, useLayoutEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, ToastAndroid, ActivityIndicator } from 'react-native'
import { Input, Button } from 'react-native-elements';
import {auth, db} from '../Firebase'
import { GlobalStore } from '../GlobalStore/Store';

const RegisterScreen = ({navigation}) => {

    const {state, dispatch} = useContext(GlobalStore)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [name, setName] = useState("");
    const [logo, setLogo] = useState(true)

    const register = () => {
        dispatch({type: "START_LOADING"});

        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            dispatch({type: "STOP_LOADING"})

            authUser.user.updateProfile({
                displayName: name,
            })
            .then(() => {
                db.collection('users').doc(authUser.user.uid).set({
                    name: name,
                    email: email
                })
            })
        })
        .catch(err => {
            dispatch({type: "STOP_LOADING"})
            
            ToastAndroid.show(err.message, ToastAndroid.SHORT)
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chitthi',
            headerTitleAlign: 'center',
            headerTitleStyle: {color: 'whitesmoke', fontWeight: 'bold',  fontSize: 22},
            headerTintColor: 'whitesmoke',
    })}, [])

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
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {
                state.loader
                ?
                <View style={styles.loader}>
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
                        placeholder="Full Name"  
                        type="name" 
                        value={name}
                        onChangeText={text => setName(text)}
                        onFocus={() => handleFocus()}
                        onBlur={() => handleBlur()}
                        />

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
                        onFocus={() => handleFocus()}
                        onBlur={() => handleBlur()}
                        />
                    </View>
                    <View style={styles.btn}>
                        <Button raised title="Register" onPress={register} />
                    </View>
                </View>
            }
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    loader: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    screen: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 50,
        color: '#2196F3'
    },
    inp: {
        width: 300,
        marginTop: '10%'
    },
    btn: {
        width: 200,
        marginTop: 20,
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
})

export default RegisterScreen