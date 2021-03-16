import React,{useLayoutEffect, useState, useContext} from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import {Image} from 'react-native-elements'
import {auth, firebase} from '../Firebase'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import {GlobalStore} from '../GlobalStore/Store'

const EditPic = ({navigation}) => {
    const {state, dispatch} = useContext(GlobalStore)
    const [pic, setPic] = useState(auth.currentUser.photoURL)
    const [uploading, setUploading] = useState(state.loader)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Edit Profile Picture',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'white'
            },
            headerTitleStyle: {color: '#2196F3', fontWeight: 'bold',  fontSize: 22},
            headerTintColor: '#2196F3',
        })
    })

    const uploadPic = async (image) => {
        const response = await fetch(image)
        const blob = await response.blob()

        let storageRef = firebase.storage().ref().child("images/" + auth.currentUser.uid)
        const uploadTask = storageRef.put(blob)


        const taskProgress = snapShot => {
            setUploading(true)
            dispatch({type: "START_LOADING"})
            console.log(snapShot.bytesTransferred)
        }

        const taskCompleted = () => {
            uploadTask.snapshot.ref.getDownloadURL()
            .then(snapShot => {
                setPic(snapShot)
                auth.currentUser.updateProfile({
                    photoURL: snapShot
                })
                setUploading(false)
                dispatch({type: "STOP_LOADING"})
            })
        }

        const taskError = () => {
            setUploading(false)
            dispatch({type: "STOP_LOADING"})
            ToastAndroid.show('Something Went Wrong!!', ToastAndroid.SHORT)
        }

        uploadTask.on("state_changed", taskProgress, taskError, taskCompleted)

    }

    const gallery = async () => {
        const granted = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);

        if(granted){
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            })

            if(!data.cancelled){
                uploadPic(data.uri)
            }
        } else ToastAndroid.show('You need to grant Permission', ToastAndroid.SHORT)
    }

    const camera = async () => {
        const granted = await Permissions.askAsync(Permissions.CAMERA);

        if(granted){
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            })

            if(!data.cancelled){
                uploadPic(data.uri)
            }
        } else ToastAndroid.show('You need to grant Permission', ToastAndroid.SHORT)
    }



    return (

        <View style={styles.container}>
            <View style={{marginTop: '15%'}}></View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ProfilePic', {chatName: auth.currentUser.displayName, pic})}>
                <Image
                source={{
                    uri: pic ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXsZsyH1-UV3P-51B1Jtk0xVHkgzEc1isDIw&usqp=CAU'
                }}
                style={styles.img}
                />
            </TouchableOpacity>
            {
                uploading 
                ? 
                <View style={styles.loader}>
                    <ActivityIndicator
                    size="large"
                    color="#2196F3"
                    />
                </View>
                :
                <View style={styles.btn}>
                    <TouchableOpacity style={styles.gbtn} activeOpacity={0.7} onPress={gallery}>
                        <Text style={styles.btntext}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cbtn} activeOpacity={0.7} onPress={camera}>
                        <Text style={styles.btntext}>Camera</Text>
                    </TouchableOpacity>
                </View>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 30
    },
    img: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgText: {
        color: 'white',
        fontSize: 30
    },
    loader: {
        marginTop: '10%',
    },
    btn: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '20%',
        width: '80%',
        justifyContent: 'space-around'
    },
    gbtn: {
        backgroundColor: '#51bbfe',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 50,
        borderRadius: 10
    },
    cbtn: {
        backgroundColor: '#ed6a5a',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 50,
        borderRadius: 10
    },
    ubtn: {
        marginTop: 20,
        backgroundColor: 'dodgerblue',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 50,
        borderRadius: 10
    },
    btntext: {
        color: 'whitesmoke'
    }
})

export default EditPic
