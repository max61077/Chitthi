import React, {useState, useEffect, useLayoutEffect} from 'react'
import {Alert, Text, View, ToastAndroid, ActivityIndicator} from 'react-native'
import {ListItem, Avatar} from 'react-native-elements'
import {TouchableOpacity} from 'react-native'
import { Entypo } from '@expo/vector-icons';
import {db, auth, firebase} from '../Firebase';

const UserList = ({id, name, email}) => {
    const [sent, setSent] = useState('')
    const [pic, setPic] = useState('')
    const [loading, setLoading] = useState(true)

    useLayoutEffect(() => {
        firebase.storage().ref().child("images/" + id).getDownloadURL()
        .then(snapShot => setPic(snapShot))
        .catch(err => console.log(err.message))
    }, [])

    useEffect(() => {
        
        db.collection('contacts')
       .doc(auth.currentUser.uid)
       .collection('requests')
       .onSnapshot(snapShot => {

            setSent('')

            snapShot.forEach(doc => {
                const data = doc.data();
                if(data.id === id){
                    setSent(data.status)
                    return
                }
                
            }) 
            setLoading(false)     
       })

    }, [])


    const sendRequest = () => {
        
        ToastAndroid.showWithGravityAndOffset(
            `Request sent to ${name}`, 
            ToastAndroid.SHORT, 
            ToastAndroid.TOP,
            0,
            200
        )
        db.collection('contacts')
        .doc(auth.currentUser.uid)
        .collection('requests')
        .doc(id)
        .set({
            id: id,
            name: name,
            status: 'requestsent'
            
        }).then(() => {
            db.collection('contacts')
            .doc(id)
            .collection('requests')
            .doc(auth.currentUser.uid)
            .set({
                id: auth.currentUser.uid,
                name: auth.currentUser.displayName,
                status: 'requestreceived'
            })
        })
        .catch(err => alert(err))
    }

    const cancelRequest = () => {

        setSent('')
        db.collection('contacts')
        .doc(auth.currentUser.uid)
        .collection('requests')
        .doc(id)
        .delete()
        .then(() => {
            db.collection('contacts')
            .doc(id)
            .collection('requests')
            .doc(auth.currentUser.uid)
            .delete()
        })
        .catch(err => alert(err))
    }

    const addFriend = () => {

        db.collection('contacts')
        .doc(auth.currentUser.uid)
        .collection('requests')
        .doc(id)
        .set({
            id: id,
            name: name,
            status: 'friends'
            
        }).then(() => {
            db.collection('contacts')
            .doc(id)
            .collection('requests')
            .doc(auth.currentUser.uid)
            .set({
                id: auth.currentUser.uid,
                name: auth.currentUser.displayName,
                status: 'friends'
            })

            
        }).then(() => createChat())
        .catch(err => alert(err))
    }

    const createChat = async() => {

        await db.collection('users')
        .doc(auth.currentUser.uid)
        .collection('friends')
        .doc(id)
        .set({
            name: name,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(async() => {
            await db.collection('users')
            .doc(id)
            .collection('friends')
            .doc(auth.currentUser.uid)
            .set({
                name: auth.currentUser.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        })
        .catch(err => alert(err))

    }

    const unFriend = () => {

        db.collection('users')
        .doc(auth.currentUser.uid)
        .collection('friends')
        .doc(id)
        .delete()
        .then(() => { 
            db.collection('users')
            .doc(id)
            .collection('friends')
            .doc(auth.currentUser.uid)
            .delete()
        })
        .then(() => cancelRequest())
        .catch(err => alert(err))
    } 

    const renderRequests = (req) => {
        switch(req){
            case "requestsent" : return(
                <Text 
                onPress={() => Alert.alert(
                    'Request',
                    `Do you want to Cancel Request`,
                    [
                        {
                            text: 'Yes',
                            onPress: () => cancelRequest()
                        },
                        {
                            text: 'No'
                        }
                    ], {
                        cancelable: false
                    }
                )} 
                style={{color: 'tomato'}}
                >Cancel Request</Text>
            )
            case "requestreceived" : return (

                <View style={
                    {display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-around', 
                    width: 150}}>

                    <Text 
                    onPress={() => addFriend()}
                    style={{color: '#0DC926', fontSize: 17}}
                    >Accept</Text>
                    <Text 
                    onPress={() => Alert.alert(
                        'Request',
                        `Do you want to Cancel Request`,
                        [
                            {
                                text: 'Yes',
                                onPress: () => cancelRequest()
                            },
                            {
                                text: 'No'
                            }
                        ], {
                            cancelable: false
                        }
                    )} 
                    style={{color: 'tomato', fontSize: 17}}
                    >Reject</Text>

                </View>
            )

            case "friends": return (
                <Text
                style={{
                    color: '#2196F3',
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginRight: 20
                }}
                
                onPress={() => Alert.alert(
                    'Friends',
                    `Do you want to Unfriend ${name}?`,
                    [
                        {
                            text: 'Unfriend',
                            onPress: () => unFriend()
                        },
                        {
                            text: 'No'
                        }
                    ], {
                        cancelable: false
                    }
                )} 
                >
                Friends</Text>
            )
            
            default: return( 
                <Entypo 
                name="add-user" 
                style={{marginRight: 10}}
                size={24} 
                color="#2196F3"
                onPress={() => sendRequest()}
                />
            )
        }
    }

    return (
        <ListItem key={id} bottomDivider>
            <Avatar
            rounded
            size="medium"
            source={{uri: pic 
                || 
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXsZsyH1-UV3P-51B1Jtk0xVHkgzEc1isDIw&usqp=CAU'
            }}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold', color: 'darkslategrey'}}>{name}</ListItem.Title>
                <ListItem.Subtitle>{email}</ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity>
                {
                    loading
                    ?
                    <ActivityIndicator
                    size="small"
                    color="#2196F3"
                    />
                    :
                    renderRequests(sent)
                }
            </TouchableOpacity>
        </ListItem>
    )
}

export default UserList
