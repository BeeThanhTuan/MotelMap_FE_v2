import {Dimensions,StyleSheet,Text,View,Platform,TouchableOpacity,ScrollView,Animated,PanResponder,Image,Modal} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, {Component,useCallback,useEffect,useState,useRef,} from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import NumberFormat from 'react-native-localize';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const BOTTOM_SHEET_MAX_HIGHT = SCREEN_HEIGHT * 1;
const BOTTOM_SHEET_MIN_HIGHT = SCREEN_HEIGHT * 0.2;
const MAX_UPWARD_TRANSLATE_Y = BOTTOM_SHEET_MIN_HIGHT - BOTTOM_SHEET_MAX_HIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 70;

const OVERVIEW = "OVERVIEW";
const DESCRIBE = "DESCRIBE";
const CONTACT = "CONTACT";

const URL = 'http://192.168.1.108:3000';

export default function BottomSheet({ marker }) {
  const [page, setPage] = useState<string>("OVERVIEW");
  return (
    <View>
      <MainComponent marker={marker} page={page} setPage={setPage} />
    </View>
  );
}

const MainComponent = ({
  marker,
  page,
  setPage,
}: {
  marker:any,
  page: string;
  setPage: Function;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset();
        // lastGestureDy.current += gesture.dy;
        if (gesture.dy > 0) {
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation("up", 50);
          } else {
            springAnimation("down", 50);
          }
        } else {
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation("down", 50);
          } else {
            springAnimation("up", 50);
          }
        }
      },
    })
  ).current;

  const springAnimation = (direction: "up" | "down", damping: number) => {
    lastGestureDy.current =
      direction === "down" ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y;
    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
      damping,
    }).start();
  };
  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const openModal = (index:any) => {
    setSelectedImage(images[index]);
    setModalVisible(true);
  };

  const images = marker.Image.map((image:any) => image.Image);


  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[styles.bottomSheetContainer, bottomSheetAnimation]}
      >
        <View style={styles.draggableArea} {...panResponder.panHandlers}>
          <View style={styles.line} />
        </View>
        <View style={styles.content} {...panResponder.panHandlers}>
          <View style={styles.nameMotel}>
            <Text style={{ fontSize: 19, textTransform: 'capitalize' }}>Nhà trọ {marker.NameMotel} </Text>
          </View>
          <View style={styles.control}>
            <TouchableOpacity style={styles.bntDrawWay}>
              <FontAwesome5Icon name="directions" size={15} color="#fff" />
              <Text style={styles.draw}>Đường đi</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mainContent}>
          <ScrollView nestedScrollEnabled={true}>
            <ScrollView
              horizontal={true}
              style={styles.imagesBox}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 15,
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <View style={styles.largeImageBox}>
                  <TouchableOpacity onPress={()=>openModal(0)}>
                    <Image
                      style={{ width: "100%", height: "100%", borderRadius: 7 }}
                      source={{ uri: `${URL}/resources/${images[0]}` }}
                    />
                  </TouchableOpacity>
                </View>
                {images.length > 1 ? (
                <View style={styles.smallImageBox}>
                  {images[1]!== '' ? 
                  (<TouchableOpacity onPress={()=>openModal(1)}>
                    <Image
                      style={{ width: "100%", height: 170, borderRadius: 7 }}
                      source={{ uri: `${URL}/resources/${images[1]}` }}
                    />
                  </TouchableOpacity>) : null}
                  {images[2]!=='' ? 
                    (<TouchableOpacity onPress={()=>openModal(2)}>
                    <Image
                      style={{ width: "100%", height: 170, borderRadius: 7 }}
                      source={{ uri: `${URL}/resources/${images[2]}` }}
                    />
                  </TouchableOpacity>) : null}
                </View>
                ) : null}
                {images.length > 3 ? (
                <View style={styles.largeImageBox}>
                  <TouchableOpacity onPress={()=>openModal(3)}>
                    <Image
                      style={{ width: "100%", height: "100%", borderRadius: 7 }}
                      source={{ uri: `${URL}/resources/${images[3]}` }}
                    />
                  </TouchableOpacity>
                </View>
                ) : null}
                {images.length > 4 ? (
                  <View style={styles.smallImageBox}>
                  {images[4]!=='' &&
                  (<TouchableOpacity onPress={()=>openModal(4)}>
                    <Image
                      style={{ width: "100%", height: 170, borderRadius: 7 }}
                      source={{ uri: `${URL}/resources/${images[4]}` }}
                    />
                  </TouchableOpacity>)}
                  {images[5]!== '' &&
                  (<TouchableOpacity onPress={()=>openModal(5)}>
                    <Image
                      style={{ width: "100%", height: 170, borderRadius: 7 }}
                      source={{ uri: `${URL}/resources/${images[5]}` }}
                    />
                  </TouchableOpacity>)}
                </View>
                ) : null}
              </View>
            </ScrollView>
            <View style={styles.nav}>
              <TouchableOpacity
                style={styles.bntControl}
                onPress={() => {
                  setPage(OVERVIEW);
                }}
                disabled={page === OVERVIEW ? true : false}
              >
                <Text
                  style={[
                    styles.bntText,
                    page === OVERVIEW ? styles.activeText : null,
                  ]}
                >
                  Tổng quan
                </Text>
                {page === OVERVIEW ? (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -3,
                      width: "100%",
                      height: 3,
                      backgroundColor: "#2966dc",
                      borderRadius: 10,
                    }}
                  ></View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bntControl}
                onPress={() => {
                  setPage(DESCRIBE);
                }}
                disabled={page === DESCRIBE ? true : false}
              >
                <Text
                  style={[
                    styles.bntText,
                    page === DESCRIBE ? styles.activeText : null,
                  ]}
                >
                  Mô tả
                </Text>
                {page === DESCRIBE ? (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -3,
                      width: "100%",
                      height: 3,
                      backgroundColor: "#2966dc",
                      borderRadius: 10,
                    }}
                  ></View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bntControl}
                onPress={() => {
                  setPage(CONTACT);
                }}
                disabled={page === CONTACT ? true : false}
              >
                <Text
                  style={[
                    styles.bntText,
                    page === CONTACT ? styles.activeText : null,
                  ]}
                >
                  Liên hệ
                </Text>
                {page === CONTACT ? (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -3,
                      width: "100%",
                      height: 3,
                      backgroundColor: "#2966dc",
                      borderRadius: 10,
                    }}
                  ></View>
                ) : null}
              </TouchableOpacity>
            </View>
            {page === OVERVIEW ? <OverviewComponent marker={marker}/> : null}
            {page === DESCRIBE ? <DescribeComponent  marker={marker}/> : null}
            {page === CONTACT ? <ContactComponent  marker={marker}/> : null}
          </ScrollView>
        </View>
      </Animated.View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          flex: 1,
        }}
        
      >
        <LinearGradient
          colors={["#232323", "#474747"]}
          locations={[0.1, 0.9]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ position: "absolute", top: 40, left: 20 }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#434343",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesignIcon name="close" size={25} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: "100%", height: "70%", alignSelf: "center" }}
              source={{uri: `${URL}/resources/${selectedImage}`}}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
};
const OverviewComponent = ({ marker }: { marker: any }) => {
  const formatPhoneNumber = (phoneNumber:string) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return '';
  };

  const formatCurrency = (value:any) => {
    const numberValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numberValue)) {
      return ''; // Return empty string if value is not a number
    }
    const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numberValue);
    return formattedValue;
  };
  return (
    <View style={styles.infoArea}>
      <View style={[styles.infoLine]}>
        <View style={styles.icon}>
          <MaterialCommunityIcon
            name="map-marker-outline"
            size={30}
            color="#2966dc"
          />
        </View>
        <View style={styles.info}>
          <Text style={[styles.text, { textTransform: "capitalize" }]}>
            {marker.Address}, {marker.SubDistrict},
          </Text>
          <Text style={styles.text}> Thành phố Quy Nhơn, Bình Định</Text>
        </View>
      </View>
      <View style={[styles.infoLine]}>
        <View style={styles.icon}>
          <FontAwesomeIcon name="phone" size={28} color="#2966dc" />
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{formatPhoneNumber(marker.Landlord.NumberPhone)}</Text>
        </View>
      </View>
      <View style={[styles.infoLine]}>
        <View style={styles.icon}>
          <MaterialIcon name="attach-money" size={28} color="#2966dc" />
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{formatCurrency(marker.Price)}</Text>
        </View>
      </View>
    </View>
  );
};
const DescribeComponent = ({ marker }: { marker: any }) => {
  const formatCurrency = (value:any) => {
    const numberValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numberValue)) {
      return ''; // Return empty string if value is not a number
    }
    const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numberValue);
    return formattedValue;
  };

  return (
    <View style={{ width: "100%", flexDirection: "column" }}>
      <View style={[styles.infoLine, { flexDirection: "column" }]}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: "#626262",
            marginBottom: 5,
          }}
        >
          Giới thiệu
        </Text>
        <Text style={[styles.text, { lineHeight: 25 }]}>
          {marker.Description}
        </Text>
      </View>
      <View style={[styles.infoLine, { flexDirection: "column" }]}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: "#626262",
            marginBottom: 5,
          }}
        >
          Tiện nghi
        </Text>
        <Text style={[styles.text, { lineHeight: 25 }]}>
         {marker.Convenient}
        </Text>
      </View>
      <View style={[styles.infoLine, { flexDirection: "column" }]}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: "#626262",
            marginBottom: 5,
          }}
        >
          Giá
        </Text>
        <View style={{ width: "100%", flexDirection: "column" }}>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.text}>Giá nhà trọ: </Text>
            <Text style={styles.text}>{formatCurrency(marker.Price)}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.text}>Giá điện: </Text>
            <Text style={styles.text}>{formatCurrency(marker.PriceElectric)}/kwh</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 5}}>
            <Text style={styles.text}>Giá giá nước: </Text>
            <Text style={styles.text}>{formatCurrency(marker.PriceWater)}/m³</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 5, paddingBottom: 5 }}>
            <Text style={styles.text}>Giá giá wifi: </Text>
            <Text style={styles.text}>{formatCurrency(marker.PriceWifi)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const ContactComponent = ({ marker }: { marker: any }) => {
  const formatPhoneNumber = (phoneNumber:string) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return '';
  };

  return (
    <View style={{ width: "100%", flexDirection: "column" }}>
      <View style={[styles.infoLine]}>
        <View style={styles.icon}>
          <MaterialCommunityIcon
            name="map-marker-account-outline"
            size={30}
            color="#2966dc"
          />
        </View>
        <View style={styles.info}>
          <Text style={[styles.text, { textTransform: "capitalize" }]}>
            {marker.Landlord.Address},
          </Text>
          <Text style={styles.text}> Thành phố Quy Nhơn, Bình Định</Text>
        </View>
      </View>
      <View style={[styles.infoLine]}>
        <View style={styles.icon}>
          <FontAwesome5Icon name="user-tie" size={23} color="#2966dc" />
        </View>
        <View style={styles.info}>
          <Text style={[styles.text, { textTransform: "capitalize" }]}>
            {marker.Landlord.HostName}
          </Text>
        </View>
      </View>
      <View style={[styles.infoLine]}>
        <View style={styles.icon}>
          <FontAwesomeIcon name="phone" size={28} color="#2966dc" />
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>{formatPhoneNumber(marker.Landlord.NumberPhone)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT - 35,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: BOTTOM_SHEET_MIN_HIGHT - BOTTOM_SHEET_MAX_HIGHT,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#a8bed2",
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: { width: 2, height: 2 },
      },
    }),
  },
  draggableArea: {
    width: 132,
    height: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: 70,
    height: 5,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
    borderRadius: 10,
  },
  content: {
    width: SCREEN_WIDTH,
  },
  nameMotel: {
    width: "100%",
    paddingLeft: 14,
  },
  control: {
    width: "100%",
    marginTop: 10,
    paddingLeft: 14,
    justifyContent: "flex-start",
  },
  bntDrawWay: {
    width: 110,
    flexDirection: "row",
    backgroundColor: "#2966dc",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 19,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  draw: {
    color: "#fff",
    fontWeight: "700",
  },
  imagesBox: {
    width: SCREEN_WIDTH,
    maxHeight: 350,
    height: 350,
  },
  mainContent: {
    flex: 1,
    marginTop: 13,
  },
  largeImageBox: {
    width: 270,
    height: 350,
  },
  smallImageBox: {
    width: 160,
    height: 350,
    flexDirection: "column",
    gap: 10,
  },
  nav: {
    width: "100%",
    height: 60,
    justifyContent: "space-between",
    borderBottomWidth: 3,
    borderBottomColor: "#d3d3d3",
    flexDirection: "row",
    alignContent: "center",
  },
  bntControl: {
    width: "33%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bntText: {
    textTransform: "uppercase",
    fontSize: 16,
    fontWeight: "600",
    color: "#626262",
  },
  activeText: {
    color: "#2966dc",
  },
  infoArea: {
    width: "100%",
    flexDirection: "column",
  },
  infoLine: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  icon: {
    width: "15%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  info: {
    width: "85%",
    flexDirection: "column",
    gap: 7,
  },
  text: {
    fontSize: 16,
    color: "#626262",
  },
});
