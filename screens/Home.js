import React, { useEffect, useState, useCallback, useRef  } from 'react';
import { StyleSheet, View, StatusBar, Text,Animated, TextInput, Keyboard, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import MapView, { Marker,Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../components/BottomSheet';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {useNavigation, useFocusEffect} from "@react-navigation/native"
import {getToken } from '../SecureStorage/SecureStorage';
import axios from '../axiosConfig';
// import MapboxClient from '@mapbox/react-native-mapbox-gl';
// const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoibmd1eWVudGhhbmh0dWFuIiwiYSI6ImNseHcwNmhhNjEwcHoyaXNkd2ZkbGFsYTQifQ.KnIDBqAyZCpCSRzeBRs39w';
// const mapbox = new MapboxClient({ accessToken: MAPBOX_ACCESS_TOKEN });
const URL = 'http://192.168.1.108:3000';
export default function Home() {
    const navigation = useNavigation();
    const [isLogin, setIsLogin] = useState(false); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    useFocusEffect(
        useCallback(() => {
            const checkToken = async () => {
                // Lấy và kiểm tra token
                const token = await getToken();
                if (token) {
                    // Nếu token tồn tại, set isLogin thành true
                    setIsLogin(true);
                } else {
                    // Ngược lại, set isLogin thành false
                    setIsLogin(false);
                }
            };
            // Gọi hàm kiểm tra token khi màn hình Home được focus
            checkToken();
        }, [])
    );

    useEffect(() => {
        axios.get(`${URL}/api/motels/accept=0`)
          .then((response) => {
            setData(response.data)
        })
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
    }, []);
    
    useEffect(() => {
        handleSearch();
    }, [search]);

    const handleChangeText = (text) => {
        setSearch(text);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.post(`${URL}/api/motels/search`, { search });
            if(response){
                setData(response.data)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const initialRegion = {
        latitude: 13.7596,
        longitude: 109.2166,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    // State để lưu trữ marker được chọn và trạng thái của BottomSheet
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);


    // Hàm xử lý khi click vào marker
    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        setBottomSheetVisible(true);
    };

    // Hàm đóng BottomSheet
    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    // Hàm xử lý khi click vào màn hình 
    const handleMapPress = () => {
        if (bottomSheetVisible) {
            closeBottomSheet();
        }
    };

    // Xử lý khi người dùng ko focus vào search thì tắt keyboard
    const [textInputFocused, setTextInputFocused] = useState(false);
    const handleRemoveKeyboard = () => {
        if (textInputFocused) {
          Keyboard.dismiss();
          setTextInputFocused(false);
        }
    };

    // xử lý filter
    const [isExpanded, setIsExpanded] = useState(false);

    const handlePress = () => {
        setIsExpanded(true);
    };


    // state = {
    //     coordinates: [
    //       { latitude: 13.766835, longitude: 109.218283 }, // Start coordinate
    //       { latitude: 13.756950, longitude: 109.217882}, // End coordinate
    //     ],
    //     routeCoordinates: [],
    // };

    // componentDidMount = () => {
    //     this.getDirections();
    // };
    

    // getDirections = async () => {
    //     const response = await mapbox.getDirections({
    //       profile: 'driving-traffic',
    //       coordinates: this.state.coordinates.map(coord => [coord.longitude, coord.latitude]),
    //     });
    
    //     const route = response.entity.routes[0];
    //     const routeCoordinates = route.geometry.coordinates.map(coord => ({
    //       latitude: coord[1],
    //       longitude: coord[0],
    //     }));
    
    //     this.setState({ routeCoordinates });
    // };

    return (
        // Sử dụng GestureHandlerRootView để xử lý các sự kiện cử chỉ
        <GestureHandlerRootView style={{ flex: 1 }}>        
            <View style={styles.container}>
                {/* Thanh trạng thái của ứng dụng */}
                <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
                {/* Bản đồ */}
                <TouchableWithoutFeedback onPress={handleRemoveKeyboard}>
                    <MapView
                       style={styles.map}
                       provider={PROVIDER_DEFAULT} // Sử dụng provider mặc định
                       initialRegion={initialRegion}
                       showsUserLocation
                       showsMyLocationButton={true}
                       onPress={handleMapPress} 
                       customMapStyle={{
                         style: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                       }}
                    >
                        {/* Render các marker trên bản đồ */}
                        {data.map(marker => (
                            <Marker
                                key={marker._id}
                                coordinate={{
                                    latitude: parseFloat(marker.LatLng.split(',')[0].trim()),
                                    longitude: parseFloat(marker.LatLng.split(',')[1].trim()), 
                                }}
                                onPress={() => handleMarkerPress(marker)}
                                image={require('../assets/images/marker.png')}
                            />
                        ))}

                        {/* <Polyline coordinates={this.state.routeCoordinates} strokeWidth={4} strokeColor="blue" /> */}
                               
                    </MapView>
                </TouchableWithoutFeedback>
                <View style={{position: 'absolute', width: '100%', height: 45, top: 50, justifyContent:'center', alignItems: 'center' }}>
                    <View style={{width: '95%', height: '100%', backgroundColor: '#fff', borderRadius: 23, alignItems: 'center',elevation: 5,
                     shadowColor: '#000',shadowOpacity: 0.3, shadowRadius: 4,shadowOffset: {width: 0,height: 2,},flexDirection:'row', paddingHorizontal: 10}}> 
                        <View style={{width: '10%', height: '100%', justifyContent:'center', alignItems: 'center'}}>
                            <MaterialIcons name="map-marker" size={30} color="#039445" />
                        </View> 
                        <View style={{width: '80%', height: '100%', justifyContent:'center', alignItems: 'center'}}>
                            <TextInput style={{width: '100%', paddingHorizontal: 10, fontSize: 17, color:'#343334'}} 
                                placeholder='Tìm kiếm theo địa chỉ'
                                placeholderTextColor="#757575"
                                value={search}
                                onBlur={() => setTextInputFocused(false)}
                                onFocus={() => setTextInputFocused(true)}
                                onChangeText={(text)=> handleChangeText(text)}
                                // onEndEditing={()=>handleSearch()}
                                />
                        </View>
                        {isLogin === false ? (
                            <View style={{ width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => { navigation.navigate("Login") }}>
                                    <Image
                                        style={{ width: 32, height: 32, borderRadius: 16, borderColor: 'gray', borderWidth: 1 }}
                                        source={require("../assets/images/user.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => { navigation.navigate("Account") }}>
                                    <Image
                                        style={{ width: 32, height: 32, borderRadius: 16, borderColor: 'gray', borderWidth: 1 }}
                                        source={require("../assets/images/landlord.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {!isExpanded ? (
                    <TouchableOpacity onPress={handlePress} style={styles.filter}>
                       <FeatherIcon name="search" size={25} color="#039445" />
                    </TouchableOpacity>
                    ) : (
                    <View style={styles.filterArea}>
                        <View>
                            <Text>123</Text>
                        </View>
                        <View style={{position: 'absolute', top: 5, right: 5}}>
                            <TouchableOpacity onPress={()=>{setIsExpanded(false);}}>
                                <FeatherIcon name="x" size={25} color="#039445" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    )}
                
                
                {/* Hiển thị BottomSheet */}
                {bottomSheetVisible && selectedMarker && (
                    <BottomSheet
                        marker={selectedMarker}
                        onClose={closeBottomSheet}
                        onPress={() => {}} 
                    />
                )}

            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight: '100%',
    },
    filter: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: 100,
        left: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        elevation: 5,
    },
    filterArea: {
        position: 'absolute',
        width: 345,
        height: 100,
        top:50,
        left: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {width: 0,height: 2,}
    },
});
