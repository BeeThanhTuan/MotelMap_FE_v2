import { StyleSheet, Text, View, Image, TextInput, StatusBar, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import {useNavigation} from "@react-navigation/native"
import axios from '../axiosConfig';
import FlashMessage from 'react-native-flash-message';
import { showMessageError, showMessageSuccess } from '../showMessages/showMessage';
import { setToken, getToken, deleteToken } from '../SecureStorage/SecureStorage';
const URL = 'http://192.168.1.108:3000';
const Login = () => {
    const navigation = useNavigation();
    const [textInputFocused, setTextInputFocused] = useState(false);
    const handleRemoveKeyboard = () => {
        if (textInputFocused) {
            Keyboard.dismiss();
            setTextInputFocused(false);
        }
    };


    // handler login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); 
    const [isFormValid, setIsFormValid] = useState(false); 


    useEffect(() => {
        validateForm();
    }, [username, password]);


    
    const validateForm = () => {
        let errors = {};
        if(!username.trim()){
            errors.username = 'Username is required.'
        }
        if(!password.trim()){
            errors.password = 'Password is required.'
        }
        // Set the errors and update form validity 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0);
    };


    const handleLogin = async () => {
        if (isFormValid) {
            try {
                const res = await axios.post(`${URL}/api/login`, { username, password });
                showMessageSuccess('Đăng nhập thành công.');
                setToken(res.data.token)
                setTimeout(()=>{
                    navigation.navigate('Home')
                }, 1000)

            } catch (error) {
                // Xử lý lỗi ở đây
                if (error.response) {
                    // Nếu có phản hồi từ server, bạn có thể trích xuất mã lỗi và thông báo từ đó
                    const status = error.response.status;
                    const message = error.response.data.message;
                    console.error('Error:', status, message);
                    // Hiển thị thông báo lỗi cho người dùng dựa trên mã lỗi và thông báo
                    if (status === 401) {
                        // Unauthorized
                        if(message === 'User invalid'){
                            showMessageError('Người dùng không tồn tại. Vui lòng nhập lại!');
                        }
                        else if(message === 'Incorrect password'){
                            showMessageError('Mật khẩu không đúng. Vui lòng nhập lại!');
                        }
                    }
                } 
            }
        }
    };
    
    return (
        <TouchableWithoutFeedback onPress={handleRemoveKeyboard} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#fdfdfd' }}>
            <View style={{ position: 'absolute', top: 30, left: 0, right: 0, zIndex: 999 }}>
                <FlashMessage position="top" />
            </View>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
            <View style={[styles.box]} />
            <View style={[styles.box1]} />
            <View style={[styles.box2]} />
            <View style={{position:'absolute', zIndex: 50, width:'100%', justifyContent:'center', alignItems: 'center', top: 50}}>
                <TouchableOpacity style={{position: 'absolute', left: 25, zIndex:50}}
                 onPress={() =>{navigation.goBack()}}>
                    <FontAwesome6Icon name="angle-left" size={33} color="black" style={{fontWeight: '600'}}/>
                </TouchableOpacity>
                <Text style={{fontSize: 30, fontWeight: '500'}}>Login</Text>
            </View>
            
            <View style={styles.container}>
                <Image
                    style={{ width: 170, height: 200, resizeMode: 'contain', position: 'absolute', top: -145, right: 40 }}
                    source={require("../assets/images/men.png")}
                />
                <View style={{ width: '100%', height: '100%', flexDirection: 'column', marginTop: 30 }}>
                    <View style={{ width: '100%', flexDirection: 'column', marginBottom: 20 }}>
                        <View style={{ width: '100%', height: 40, marginTop: 5, flexDirection: 'row', borderBottomWidth: 2, borderColor: '#989898', alignItems: 'center' }}>
                            <FontAwesomeIcon name="user-o" size={23} color="gray" />
                            <View style={{ width: 2, height: 20, backgroundColor: 'gray', marginHorizontal: 10 }} />
                            <TextInput placeholder='Enter your username' style={{ fontSize: 19 }}
                                onFocus={() => setTextInputFocused(true)}
                                onBlur={() => setTextInputFocused(false)}
                                value={username}
                                onChangeText={(text)=>{
                                    setUsername(text);
                                    validateForm();
                                }}
                                 />
                        </View>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'column', marginBottom: 20 }}>
                        <View style={{ width: '100%', height: 40, marginTop: 5, flexDirection: 'row', borderBottomWidth: 2, borderColor: '#989898', alignItems: 'center' }}>
                            <SimpleLineIcon name="lock" size={22} color="gray" />
                            <View style={{ width: 2, height: 20, backgroundColor: 'gray', marginHorizontal: 10 }} />
                            <TextInput placeholder='Enter your password' style={{ fontSize: 19 }}
                                onFocus={() => setTextInputFocused(true)}
                                onBlur={() => setTextInputFocused(false)}
                                secureTextEntry={true}
                                value={password}
                                onChangeText={(text)=>{
                                    setPassword(text);
                                    validateForm();
                                }}/>
                        </View>
                    </View>
                    <TouchableOpacity 
                        onPress={handleLogin}
                        style={[{ opacity: isFormValid ? 1 : 0.5 }]} 
                        disabled={!isFormValid}
                        >
                        <View style={{ width: '100%', height: 50, backgroundColor: '#4d7881', marginTop: 40, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17, fontWeight: '600', color: '#fff' }}>Login</Text>
                        </View>
                    </TouchableOpacity>
                     
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 330,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 20,
        paddingVertical: 30,
        elevation: 10,
        backgroundColor: '#fff',
        zIndex:100,
    },
    box: {
        position: 'absolute',
        left: -30,
        top: -10,
        width: 150,
        height: 150,
        borderWidth: 2,
        borderColor: 'gray',
        backgroundColor: '#fff',
        transform: [{ rotate: '19deg' }],
        borderRadius: 75, 
        zIndex:1,
    },
    box1: {
        position: 'absolute',
        right: -50,
        top: -50,
        width: '100%',
        height: 200,
        borderWidth: 2,
        borderColor: 'gray',
        backgroundColor: '#fff',
        transform: [{ rotate: '19deg' }],
        borderRadius: 100, 
        zIndex:10,
    },
    box2: {
        position: 'absolute',
        right: 0,
        top: -70,
        width: '100%',
        height: 200,
        backgroundColor: '#4d7881',
        transform: [{ rotate: '10deg' }],
        borderRadius: 100,
        zIndex: 1,
    },
});
