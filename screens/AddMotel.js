import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, TextInput,Alert} from 'react-native'
import React, { useState, useEffect, useRef  } from 'react';
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import {useNavigation} from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker,UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { showMessageError, showMessageSuccess } from '../showMessages/showMessage';
import * as ImagePicker from 'expo-image-picker';
import {getToken} from '../SecureStorage/SecureStorage';
import JWT from 'expo-jwt';
import axios from '../axiosConfig';
// import RNFetchBlob from 'rn-fetch-blob';
const URL = 'http://192.168.1.108:3000';
const AddMotel = () => {
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
    
    const [initialRegion, setInitialRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.011,
        longitudeDelta: 0.011,
    });

    const mapViewRef = useRef(null);

    const listSubDistrict = [
        'Bùi Thị Xuân', 'Đống Đa', 'Ghềnh Ráng', 'Hải Cảng', 'Lê Hồng Phong', 'Lê Lợi', 'Lý Thường Kiệt',
        'Ngô Mây', 'Nguyễn Văn Cừ', 'Nhơn Bình', 'Nhơn Phú', 'Quang Trung', 'Thị Nại', 'Trần Hưng Đạo',
        'Trần Phú', 'Trần Quang Diệu', 'Nhơn Châu', 'Nhơn Hải', 'Nhơn Hội', 'Nhơn Lý', 'Phước Mỹ',
    ];
    
    const items = listSubDistrict.map(subDistrict => ({
        label: subDistrict,
        value: subDistrict, 
    }));


    const [namMotel, setNameMotel] = useState('');
    const [address, setAddress] = useState('');
    const [currentSubDistrict, setCurrentSubDistrict] = useState(null);
    const [description, setDescription] = useState('');
    const [convenient, setConvenient] = useState('');
    const [acreage, setAcreage] = useState('');
    const [amount, setAmount] = useState('1');
    const [hostName, setHostName] = useState('');
    const [addressHostName, setAddressHostName] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [price, setPrice] = useState('');
    const [priceWater, setPriceWater] = useState('15000');
    const [priceElectric, setPriceElectric] = useState('3500');
    const [priceWifi, setPriceWifi] = useState('0');

    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [isLocation, setIsLocation] = useState(false);

    useEffect(() => {
        if (lat !== null && lon !== null) {
            setInitialRegion({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                latitudeDelta: 0.011,
                longitudeDelta: 0.011,
            });

            if (mapViewRef.current) {
                mapViewRef.current.animateToRegion({
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon),
                    latitudeDelta: 0.011,
                    longitudeDelta: 0.011,
                }, 1000);
            }
        }
    }, [lat, lon]);

    const handleDropdownChange = async (item) => {
        if (item) {
            setCurrentSubDistrict(item.value);
            getLocation(item.value);
        }
    };

    const getLocation = async (selectedSubDistrict) => {
        const fullAddress = `${address}, ${selectedSubDistrict}, Quy Nhơn, Bình Định`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.length > 0) {
                const location = data[0];
                setLat(location.lat);
                setLon(location.lon);
                setIsLocation(true);
                // console.log(location.lat, location.lon);
                // console.log(isLocation);     
            } else {
                console.log("No results found");
                setIsLocation(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLocation(false);
        }
    };

    const handleBlur = async () => {
        await getLocation(currentSubDistrict);
    };

    const [images, setImages] = useState([]); 

    const pickMultipleImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 6,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const imageUris = result.assets.map(asset => asset.uri);
            setImages(imageUris);
            console.log(images);
        }
    };

   
    const handleAddMotel = async () =>{
        try {
            const formData = new FormData();
            formData.append('nameMotel', namMotel);
            formData.append('address', address);
            formData.append('subDistrict', currentSubDistrict);
            formData.append('description', description);
            formData.append('convenient', convenient)
            formData.append('acreage', parseInt(acreage))
            formData.append('price', parseInt(price))
            formData.append('electric', parseInt(priceElectric))
            formData.append('water', parseInt(priceWater))
            formData.append('wifi', parseInt(priceWifi))
            formData.append('amount', parseInt(amount))
            formData.append('isAccept', 1)
            formData.append('userCreate', userName)
            formData.append('numberPhone', numberPhone)
            formData.append('hostName', hostName)
            formData.append('addressHostName', addressHostName)
            formData.append('latLng', `${lat}, ${lon}`)

            images.forEach((imageUri, index) => {
                formData.append('images', {
                  uri: imageUri,
                  name: `image_${index}.jpg`,
                  type: 'image/jpeg',
                });
              });
              console.log(images);
            
            const response = await axios.post(`${URL}/api/motel`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setNameMotel('');
            setAddress('');
            setDescription('');
            setCurrentSubDistrict(null);
            setConvenient('');
            setAcreage('');
            setAmount('1');
            setHostName('');
            setAddressHostName('');
            setNumberPhone('');
            setPrice('');
            setPriceWater('15000');
            setPriceElectric('3500');
            setPriceWifi('0');
            setIsLocation(false);
            setImages([]);

            Alert.alert(
                'Thông Báo',
                'Bạn đã thêm thành công nhà trọ.',
                [{ text: 'OK' }]
              );
            console.log('Response:', response.data);
            
        } catch (error) {
            Alert.alert(
                'Thông Báo',
                'Thêm không thành công!.',
                [{ text: 'OK' }]
              );
            console.error('Error adding motel:', error);
        }
       
    }

    return (
        <View style={{flex:1}}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
            <View style={{flex :1, backgroundColor:'#fff'}}>
                <View style={{display:'flex',height: 60, flexDirection: 'row', marginTop: 30, alignItems: 'center'}} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 20}} >
                        <View style={{width: 70, height: 30, borderRadius: 20, justifyContent: "center", alignItems: "center", backgroundColor:'#4d7881'}}>
                            <AntDesignIcon name="arrowleft" size={25} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <View style={{marginLeft:15}}>
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: '#464646'}}>Thêm nhà trọ mới</Text>
                    </View>
                </View>
                <ScrollView style={{flex :1, paddingHorizontal: 20}}>
                    <View >
                        <Text style={styles.lable}>Tên nhà trọ </Text>
                        <TextInput  style={styles.inputText}
                         value={namMotel}
                         onChangeText={text => setNameMotel(text)}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Địa chỉ<Text style={{color:'red'}}> *</Text></Text>
                        <TextInput  style={styles.inputText}
                         value={address}
                         onChangeText={text => setAddress(text)}
                         onBlur={()=>{handleBlur()}}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Phường/xã<Text style={{color:'red'}}> *</Text></Text>
                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            data={items}
                            labelField="label"
                            valueField="value"
                            placeholder="Chọn phường/xã"
                            value={currentSubDistrict}
                            onChange={(item)=>handleDropdownChange(item)}
                            labelStyle={{ fontSize: 25 }}
                        />
                    </View>
                    {isLocation  ? (<View style={{width:'100%', height: 250, marginBottom: 10, borderRadius: 6}}>
                        <MapView
                            ref={mapViewRef}
                            style={{ width: '100%', height: '100%' , borderRadius: 6}}
                            provider={PROVIDER_DEFAULT}
                            initialRegion={initialRegion}
                            showsUserLocation
                            showsMyLocationButton={true}
                            >
                            <UrlTile
                                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                maximumZ={13}
                            />
                             <Marker
                                coordinate={{
                                    latitude: parseFloat(lat),
                                    longitude: parseFloat(lon), 
                                }} 
                            />
                        </MapView>
                    </View>) : null}
                    
                    <View >
                        <Text style={styles.lable}>Mô tả</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            style={styles.inputTextArea}
                            value={description}
                            onChangeText={text => setDescription(text)}
                        />
                    </View>
                    <View >
                        <Text style={styles.lable}>Tiện nghi<Text style={{color:'red'}}> *</Text></Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            style={styles.inputTextArea}
                            value={convenient}
                            onChangeText={text => setConvenient(text)}
                        />
                    </View>
                    <View >
                        <Text style={styles.lable}>Tên chủ trọ<Text style={{color:'red'}}> *</Text></Text>
                        <TextInput  style={styles.inputText}
                        value={hostName}
                        onChangeText={text => setHostName(text)}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Địa chỉ chủ trọ</Text>
                        <TextInput  style={styles.inputText}
                        value={addressHostName}
                        onChangeText={text => setAddressHostName(text)}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Số điện thoại<Text style={{color:'red'}}> *</Text></Text>
                        <TextInput  style={styles.inputText} keyboardType='numeric'
                        value={numberPhone}
                        onChangeText={text => setNumberPhone(text)}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Giá nhà trọ<Text style={{color:'red'}}> *</Text></Text>
                        <TextInput  style={styles.inputText} keyboardType='numeric'
                            value={price}
                            onChangeText={text => setPrice(text)}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Giá điện</Text>
                        <TextInput  style={styles.inputText} keyboardType='numeric'
                            value={priceElectric}
                            onChangeText={text => setPriceElectric(text)}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Giá nước</Text>
                        <TextInput  style={styles.inputText} keyboardType='numeric'
                        value={priceWater}
                        onChangeText={text => setPriceWater(text)}></TextInput>
                    </View>
                    <View >
                        <Text style={styles.lable}>Giá wifi</Text>
                        <TextInput  style={styles.inputText} keyboardType='numeric'
                        value={priceWifi}
                        onChangeText={text => setPriceWifi(text)}></TextInput>
                    </View>
                    <View style={{display:'flex'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: '50%', paddingRight: 5}}>
                                <Text style={styles.lable}>Diện tích</Text>
                                <TextInput style={styles.price}  keyboardType='numeric'
                                value={acreage}
                                onChangeText={text => setAcreage(text)}></TextInput>
                            </View>
                            <View style={{width: '50%',paddingLeft: 5, paddingRight:1}}>
                                <Text style={styles.lable}>Số phòng</Text>
                                <TextInput style={styles.price}  keyboardType='numeric'
                                value={amount}
                                onChangeText={text => setAmount(text)} ></TextInput>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ width: '100%', height: 45,  marginBottom: 15}} onPress={pickMultipleImages} >
                        <View style={styles.selectImages}>
                            <AntDesignIcon name="cloudupload" size={25} color="#a2682d" style={{ marginRight: 10 }} />
                            {images.length > 0 ? (<Text style={{fontSize: 17, fontWeight: 'bold', color: '#a2682d'}} >Đã chọn {images.length} ảnh</Text>) :
                             <Text style={{fontSize: 17, fontWeight: 'bold', color: '#a2682d'}} >Chọn ảnh</Text>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{handleAddMotel()}} >
                        <View style={{width:'100%', height: 50, borderRadius: 6, backgroundColor: '#4d7881', marginTop: 10,
                             marginBottom: 30, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize:25, fontWeight: 'bold', color: '#fff'}}>Thêm</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
  )
}

export default AddMotel

const styles = StyleSheet.create({
    lable: {
        fontSize: 20,
        color: '#464646'
    },
    inputText:{
        marginTop:5,
        height: 45,
        borderWidth: 1,
        fontSize: 18,
        color: '#464646',
        paddingHorizontal: 10,
        borderRadius: 6,
        marginBottom: 10
    },
    inputTextArea:{
        marginTop:5,
        maxHeight: 90,
        borderWidth: 1,
        fontSize: 18,
        color: '#464646',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 6,
        marginBottom: 10,
        textAlignVertical: 'top',
    },
    dropdown: {
        marginTop: 5,
        height: 45,
        borderWidth: 1,
        fontSize: 20,
        color: '#464646',
        paddingHorizontal: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#464646',
        borderRadius: 6,
    },
    price: {
        borderWidth: 1,
        height: 45,
        marginTop:5,
        borderRadius: 6,
        marginBottom: 10,
        paddingHorizontal: 10,
        fontSize:18
    },
    selectImages: {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#fc9d3d',
        borderRadius: 6,
        borderStyle: 'dashed',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
    }
})