import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View, Alert, SafeAreaView, TouchableOpacity, FlatList } from 'react-native'
import {AntDesign, SimpleLineIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import {SearchBar} from 'react-native-elements'
import CustomListItem from '../List/CustomListItem'
import {auth, db} from '../Firebase'
import {StatusBar} from 'expo-status-bar'

const Home = ({navigation}) => {
    const [userFetch, setUserFetch] = useState(true)
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState('');

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login');
        })
    }

    useEffect(() => {

        if(userFetch){
            
            const unsubscribe = db.collection('users')
            .doc(auth.currentUser.uid)
            .collection('friends')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapShot => {
                setChats(snapShot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                })))     
            })
        
            return unsubscribe;
        }

    }, [userFetch])

    const fetchUsers = (text) => {

        setSearch(text)
        setUserFetch(false)

        db.collection('users')
        .doc(auth.currentUser.uid)
        .collection('friends')
        .where('name', '>=', search.toUpperCase())
        .onSnapshot(snapShot => {
            setChats(snapShot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name
            })))
          
        })

        if(!text || text === ''){
            setUserFetch(true)
        }

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chitthi',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'white'
            },
            headerTitleStyle: {color: '#2196F3', fontWeight: 'bold',  fontSize: 22},
            headerTintColor: '#2196F3',
            headerLeft: () => (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity 
                    onPress={() => Alert.alert(
                        'Logout',
                        'Do you want to log out?',
                        [
                            {
                                text: 'Yes',
                                onPress: () => signOutUser()
                            },
                            {
                                text: 'No'
                            }
                        ], {
                            cancelable: false
                        }
                    )} 
                    activeOpacity={0.5}>
                        <MaterialCommunityIcons name="logout" size={28} color="#2196F3" />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    marginRight: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: 75
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Pic')}>
                        <AntDesign name='camerao' size={24} color="#2196F3"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('TabNav')} activeOpacity={0.5}>
                        <SimpleLineIcons name='pencil' size={22} color="#2196F3"/>
                    </TouchableOpacity>
                </View>
                )
        })
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id,
            chatName
        })
    }

    return (
        <SafeAreaView>
            <StatusBar style="dark" /> 
                <FlatList
                ListHeaderComponent={
                    <SearchBar
                    lightTheme
                    placeholder="Search Here....."
                    style={{color: 'darkslategrey'}}
                    value={search}
                    round
                    onChangeText={text => fetchUsers(text)}
                    />
                }
                data={chats}
                renderItem={({item}) => (
                    <CustomListItem key={item.id} id={item.id} chatName={item.name} enterChat={enterChat} navigation={navigation}/>
                )}
                keyExtractor={item => item.id}
                />
        </SafeAreaView>
    )
}

export default Home
