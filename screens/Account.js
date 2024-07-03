import { View, Text, Image, TouchableOpacity, StatusBar} from 'react-native'
import React , {useEffect, useState} from 'react'
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native"
import FlashMessage from 'react-native-flash-message';
import {showMessageSuccess } from '../showMessages/showMessage';
import {getToken, deleteToken} from '../SecureStorage/SecureStorage';
import JWT from 'expo-jwt';
const Account = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const decodedToken = JWT.decode(token, 'ntt-secret-key');
                    setUserName(decodedToken.username);
                    setRole(decodedToken.role);
                } else {
                    console.log('Token not found');
                }
            } catch (error) {
                console.error('Error retrieving or decoding token:', error);
            }
        };

        fetchData();
    }, []);
   
  return (
    <View style={{flex:1}}>
        <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
        <View style={{flex :1, paddingTop: 40, backgroundColor: '#fafcff'}}>
        <View style={{ position: 'absolute', top: 30, left: 0, right: 0, zIndex: 999 }}>
            <FlashMessage position="top" />
        </View>
        <View style={{ position: "absolute", top: 46, left: 20,}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View
                    style={{
                    width: 70,
                    height: 30,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: '#4d7881'   
                    }}
                >
                    <AntDesignIcon name="arrowleft" size={25} color="#fff" />
                </View>
            </TouchableOpacity>
        </View>
        <View style={{width: '100%', justifyContent: 'center', alignItems:'center'}}>
            {role == 0 ? (<Text style={{color: '#4d7881', fontSize: 30, fontWeight: 'bold'}}>Admin</Text>) :
             (<Text style={{color: '#4d7881', fontSize: 30, fontWeight: 'bold'}}>Landlord</Text>)}
        </View>
        <View style={{width: '90%', minHeight: 400,marginTop: 30, backgroundColor: '#ffffff', alignSelf: 'center',borderWidth: 1,borderColor: '#e0e0e0', borderRadius: 20,}}>
            <View style={{flexDirection: 'column', justifyContent: 'center',alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderColor: '#e0e0e0'} }>
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#4d7881', }}
                    source={require("../assets/images/landlord.png")}
                />
                <Text style={{marginTop: 10 ,fontSize: 25, fontWeight: 'bold', color: '#464646'}}>{userName}</Text>
                <TouchableOpacity onPress={()=>{
                    deleteToken();
                    showMessageSuccess('Đăng xuất thành công.');
                    setTimeout(()=>{
                        navigation.navigate('Home');
                    }, 1000)
                }}>
                    <View style={{ height: 40, marginTop: 20, borderWidth: 1.5, borderColor: '#4d7881',justifyContent: 'center',alignItems: 'center', borderRadius: 15  }}>
                        <Text style={{ fontSize: 17, fontWeight: '500', paddingHorizontal: 25, color: '#373737'}}>Sign out</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center',alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20,  }}>
            <TouchableOpacity style={{width: '100%'}} onPress={()=>{ navigation.navigate('AddMotel');}}>
                <View style={{ height: 40,alignItems: 'center', borderRadius: 15, flexDirection: 'row', }}>
                    <IonIcon name="add-circle-outline" size={30} color="black" />
                    <Text style={{ fontSize: 17, fontWeight: '500', paddingLeft: 25, color: '#373737'}}>Thêm nhà trọ mới</Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    </View>
    </View>
  )
}

export default Account