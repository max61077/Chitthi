import React, {useLayoutEffect, useState} from 'react'
import { Text, View, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, StyleSheet, FlatList, TextInput, SafeAreaView, Keyboard, Platform} from 'react-native';
import {Avatar} from 'react-native-elements'
import {Ionicons} from '@expo/vector-icons'
import {StatusBar} from 'expo-status-bar'
import { db, auth, firebase } from '../Firebase';

const Chat = ({navigation, route}) => {

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [pic, setPic] = useState('')
    const [regex] = useState(/.+/)

    useLayoutEffect(() => {
        firebase.storage().ref().child("images/" + route.params.id).getDownloadURL()
        .then(snapShot => setPic(snapShot))
        .catch(err => console.log(err.message))
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.chatName,
            headerTitleAlign: 'center',
        })
    }, [navigation, messages])

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('users')
        .doc(auth.currentUser.uid)
        .collection('friends')
        .doc(route.params.id)
        .collection('messages')
        .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoUrl: auth.currentUser.photoURL
        }).then(() => {
            db.collection('users')
            .doc(route.params.id)
            .collection('friends')
            .doc(auth.currentUser.uid)
            .collection('messages')
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoUrl: auth.currentUser.photoURL
            })
        }).catch(err => alert(err))
        .finally(
            
            db.collection('users')
            .doc(auth.currentUser.uid)
            .collection('friends')
            .doc(route.params.id)
            .set({
                name: route.params.chatName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                db.collection('users')
                .doc(route.params.id)
                .collection('friends')
                .doc(auth.currentUser.uid)
                .set({
                    name: auth.currentUser.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
            })
        )
        
        setInput('')
    }

    useLayoutEffect(() => {
        
        const unsubscribe = db
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('friends')
        .doc(route.params.id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapShot => setMessages(
            snapShot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))

        ))
        
        return unsubscribe;
    }, [route])

    const fetchDate = (date) => {
        date = date.toString()
        date = date.substr(16, 5)
        let h = Number(date.substr(0, 2))
        let m = date.substr(3)
        let mr = 'AM'
        
        if(h >= 12){
            if(h != 12)
                h = h % 12
            mr = 'PM'
        }

        return h + ":" + m + ' ' + mr

    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <FlatList
                    data={messages}
                    renderItem={({item}) => (
                        item.data.email === auth.currentUser.email ? (
                            <View key={item.id} style={styles.sender}>
                                <Text style={styles.sendText}>{item.data.message}</Text>
                                <Text style={styles.sendName}>{item.data.timestamp ? fetchDate(item.data.timestamp.toDate()) : null}</Text>
                            </View>
                        ) : (
                            <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                                <Avatar 
                                rounded 
                                size="small"
                                source={{uri: pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXsZsyH1-UV3P-51B1Jtk0xVHkgzEc1isDIw&usqp=CAU'}}/>
                                <View key={item.id} style={styles.receiver}>
                                    
                                    <Text style={styles.recvText}>{item.data.message}</Text>
                                    <Text style={styles.recvName}>{fetchDate(item.data.timestamp.toDate())}</Text>
                                </View>
                            </View>
                        )
                    )}
                    keyExtractor={item => item.id}
                    inverted
                    />

                    <View style={styles.footer}>
                        <TextInput
                            value={input}
                            onChangeText={text => setInput(text)}
                            onSubmitEditing={sendMessage}
                            placeholder="Type A Message"
                            style={styles.inp}
                        />
                        <TouchableOpacity disabled={!input || !regex.test(input)} onPress={sendMessage} activeOpacity={0.5}>
                            <Ionicons name="send" size={28} color="#2196F3" />
                        </TouchableOpacity>
                    </View>
                </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sender: {
        padding: 15,
        backgroundColor: '#2196F3',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 5,
        maxWidth: '90%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    receiver: {
        padding: 15,
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
        borderRadius: 20,
        marginLeft: 1,
        marginBottom: 5,
        maxWidth: '85%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    recvName: {
        color:'grey', 
        fontSize: 10, 
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 5
    },
    recvText: {
        color: 'darkslategrey',
    },
    sendName: {
        color:'#eee', 
        fontSize: 9, 
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 5
    },
    sendText: {
        textAlign: 'center',
        color: 'white'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    inp: {
        bottom: 0,
        height: 45,
        flex: 1,
        marginRight: 15,
        backgroundColor: '#ECECEC',
        paddingLeft: 20,
        color: 'darkslategrey',
        borderRadius: 30
    }
})