import React, { useEffect, useState, useLayoutEffect } from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import {ListItem, Avatar} from 'react-native-elements'
import { db, auth, firebase } from '../Firebase'

const CustomListItem = ({id, chatName, enterChat, navigation}) => {

    const [chatMessages, setChatMessages] = useState([])
    const [pic, setPic] = useState(null)

    useLayoutEffect(() => {
        firebase.storage().ref().child("images/" + id).getDownloadURL()
        .then(snapShot => setPic(snapShot))
        .catch(err => console.log(err.message))
    }, [])

    useEffect(() => {
        const unsubscribe = db
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('friends')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapShot => (
            setChatMessages(snapShot.docs.map(doc => doc.data()))
        ))

        return unsubscribe;
    }, [])

    const fetchDate = () => {
        let date = chatMessages?.[0]?.timestamp?.toDate().toString()

        if(date){
            let dt = new Date(date)
            let d = dt.getDate()
            let m = dt.getMonth()
            let y = dt.getFullYear()

            dt = d + '/' + (m + 1) + '/' + y
            date = dt
        }
        

        return date
    }

    return (
       <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
           <TouchableOpacity onPress={() => navigation.navigate('ProfilePic', {chatName, pic})}>
                <Avatar
                rounded
                size="medium"
                source={{
                    uri: pic ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXsZsyH1-UV3P-51B1Jtk0xVHkgzEc1isDIw&usqp=CAU'
                }}
                />
           </TouchableOpacity>
           <ListItem.Content>
               <ListItem.Title style={{fontWeight:'bold'}}>{chatName}</ListItem.Title>
               <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {chatMessages?.[0]?.message}
                </ListItem.Subtitle>
           </ListItem.Content>
           <Text style={styles.date}>{fetchDate()}</Text>
       </ListItem>
    )
}

const styles = StyleSheet.create({
    img: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    ava: {
        fontSize: 15,
        color: 'white'
    },
    date: {
        fontSize: 10,   
        color: 'darkslategrey'
    }
})

export default CustomListItem