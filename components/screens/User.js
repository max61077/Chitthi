import React, {useEffect, useState} from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import {SearchBar} from 'react-native-elements'
import {db, auth} from '../Firebase'
import UserList from '../List/UserList'

const User = () => {

    const [data, setData] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        db.collection('users')
        .where('name', '>=', search.toUpperCase())
        .onSnapshot(snapShot => {
            let userList = [];

            snapShot.forEach(user => {
                userList.push({
                    id: user.id,
                    name: user.data().name,
                    email: user.data().email
                })
            })
            
            setData(userList.filter(user => user.id !== auth.currentUser.uid))
        })

    }, [search])

    return (
        <View>
           <FlatList
           ListHeaderComponent={
               <SearchBar
               lightTheme
               placeholder="Search Here....."
               style={{color: 'darkslategrey'}}
               value={search}
               round
               onChangeText={text => setSearch(text)}
               />
           }
           style={styles.userlist}
           data={data}
           renderItem={({item}) => (
                <UserList id={item.id} name={item.name} email={item.email}/>
            )}
           keyExtractor={item => item.id}
           />
        </View>
    )
}

const styles = StyleSheet.create({
    userlist: {
        backgroundColor: 'white'
    },
    user: {
        textAlign: 'center',
        width: '100%',
        backgroundColor: 'lightblue',
        marginBottom: 1,
        padding: 3
    }
})

export default User
