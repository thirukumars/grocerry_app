import { View, StyleSheet, SafeAreaView, Image, Text } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Svg, { Path, Defs, LinearGradient, Stop, } from "react-native-svg"
import { useWindowDimensions } from 'react-native';
import Lottie from 'lottie-react-native';


const Splash = ({ navigation }) => {


    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const logoSize = windowWidth * 0.3


    useEffect(() => {
        setTimeout(async () => {
            const dataToken = await AsyncStorage.getItem('token');
            const refreshToken = await AsyncStorage.getItem('refresh')
            console.log("DATA TOKEN", dataToken, refreshToken)
            let skip = await AsyncStorage.getItem('skipLogin')
            console.log("SKIP VALUE", skip)
            if (skip == "yes") navigation.replace('TabHomeBottom');
            else {
                if (!dataToken) {
                    console.log("LOGIN PAGE")
                    console.log("NO ss")
                    navigation.replace('LoginScreen');
                } else {
                    const headers = {
                        'x-access-token': dataToken,
                    }
                    try {
                        let res = await axios.get('https://hybee-auth.moshimoshi.cloud/user', { headers })
                        if (res?.status == 200) {
                            navigation.replace('TabHomeBottom');
                        }
                    } catch (error) {
                        if (error?.response?.status == 401) {
                            console.log("UNAUTH")
                            try {
                                let refreshresponse = await axios.get('https://hybee-auth.moshimoshi.cloud/refresh?refreshToken=' + refreshToken)
                                if (refreshresponse?.status == 200) {
                                    await AsyncStorage.setItem("token", refreshresponse?.data?.data)
                                    navigation.replace('TabHomeBottom');
                                }
                            } catch (err) {
                                console.log("removing token and refresh")
                                await AsyncStorage.removeItem('token');
                                await AsyncStorage.removeItem('refresh');
                                navigation.replace('LoginScreen');
                            }
                        }
                        console.log("ERRORROR--->", error.response)
                    }

                }
            }
        }, 2000);
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* <View > */}
            {/* <View style={{ position: 'absolute', top: 0, left: 0 }}>
                <Svg
                    width={428}
                    height={239}
                    viewBox="0 0 428 239"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    <Path
                        d="M202.354 46.8216C202.909 45.8872 202.916 44.7257 202.371 43.7853L186.634 16.6252C186.09 15.6848 185.079 15.1127 183.992 15.1296L151.652 15.6329C150.61 15.6491 149.651 16.2045 149.119 17.1002L132.599 44.9062C132.044 45.8406 132.037 47.0022 132.582 47.9425L148.318 75.1027C148.863 76.0431 149.874 76.6152 150.961 76.5984L183.301 76.0964C184.342 76.0802 185.301 75.5247 185.833 74.629L202.354 46.8216Z" fill="#FFEDBF"
                    // stroke="url(#paint0_linear_107_4458)"
                    // strokeWidth={1}
                    />
                    <Path
                        d="M200.034 116.117C200.589 115.182 200.595 114.021 200.05 113.08L184.314 85.9202C183.769 84.9797 182.758 84.4076 181.672 84.4245L149.331 84.9278C148.29 84.944 147.331 85.4994 146.799 86.3951L130.278 114.201C129.723 115.136 129.717 116.297 130.262 117.237L145.998 144.398C146.543 145.338 147.554 145.91 148.64 145.893L180.98 145.391C182.022 145.375 182.981 144.82 183.513 143.924L200.034 116.117Z" fill="#FFE299"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M79.4049 118.822C79.96 117.887 79.9663 116.726 79.4215 115.785L63.6852 88.6252C63.1404 87.6848 62.1295 87.1127 61.0428 87.1296L28.7023 87.6329C27.6606 87.6491 26.702 88.2045 26.1698 89.1002L9.64953 116.906C9.0944 117.841 9.08804 119.002 9.63289 119.943L25.3692 147.103C25.914 148.043 26.9249 148.615 28.0115 148.598L60.3515 148.096C61.3933 148.08 62.352 147.525 62.8841 146.629L79.4049 118.822Z" fill="#FFE299"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M140.612 82.1436C141.167 81.2093 141.173 80.0477 140.629 79.1073L124.892 51.9473C124.347 51.0068 123.337 50.4347 122.25 50.4516L89.9093 50.9549C88.8677 50.9711 87.909 51.5265 87.3769 52.4222L70.8566 80.2283C70.3014 81.1626 70.2951 82.3242 70.8399 83.2646L86.5762 110.425C87.1211 111.365 88.1319 111.937 89.2186 111.92L121.559 111.418C122.6 111.402 123.559 110.847 124.091 109.951L140.612 82.1436Z" fill="#FFE299"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d=" M79.4049 51.1126C79.96 50.1783 79.9663 49.0167 79.4215 48.0763L63.6852 20.9163C63.1404 19.9758 62.1295 19.4037 61.0428 19.4206L28.7023 19.9239C27.6606 19.9401 26.702 20.4955 26.1698 21.3912L9.64953 49.1973C9.0944 50.1316 9.08804 51.2932 9.63289 52.2336L25.3692 79.3937C25.914 80.3341 26.9249 80.9062 28.0115 80.8894L60.3515 80.3874C61.3933 80.3712 62.352 79.8157 62.8841 78.9201L79.4049 51.1126Z" fill="#FFEDBF"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Defs>
                        <LinearGradient
                            id="paint0_linear_107_4458"
                            x1={142.411}
                            y1={-19.9033}
                            x2={256.605}
                            y2={214.654}
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop stopColor="#E0C04F" />
                            <Stop offset={1} stopColor="#B16F07" />
                        </LinearGradient>
                    </Defs>

                </Svg>
            </View>



            <View style={{ position: 'absolute', bottom: -100, right: -200 }}>
                <Svg
                    width={428}
                    height={239}
                    viewBox="0 0 428 239"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    <Path
                        d="M196.914 111.004C197.469 110.07 197.476 108.908 196.931 107.968L181.756 81.7765C181.211 80.8361 180.2 80.2639 179.114 80.2808L147.921 80.7663C146.879 80.7825 145.921 81.3379 145.388 82.2336L129.454 109.053C128.899 109.987 128.893 111.149 129.438 112.089L144.613 138.28C145.157 139.221 146.168 139.793 147.255 139.776L178.447 139.292C179.489 139.276 180.448 138.72 180.98 137.824L196.914 111.004Z" fill="#FFE9B2"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M200.668 45.3681C201.223 44.4338 201.23 43.2722 200.685 42.3318L185.51 16.1408C184.965 15.2004 183.954 14.6282 182.868 14.6451L151.675 15.1305C150.633 15.1467 149.674 15.7022 149.142 16.5978L133.208 43.4171C132.653 44.3515 132.647 45.513 133.192 46.4534L148.367 72.6446C148.911 73.5849 149.922 74.1571 151.009 74.1402L182.201 73.6561C183.243 73.6399 184.202 73.0844 184.734 72.1887L200.668 45.3681Z" fill="#FFD773"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M260.11 76.0576C260.665 75.1232 260.671 73.9617 260.126 73.0213L244.951 46.8302C244.407 45.8898 243.396 45.3176 242.309 45.3345L211.116 45.82C210.075 45.8362 209.116 46.3916 208.584 47.2873L192.65 74.1066C192.095 75.0409 192.088 76.2025 192.633 77.1429L207.808 103.334C208.353 104.274 209.364 104.847 210.45 104.83L241.643 104.346C242.684 104.329 243.643 103.774 244.175 102.878L260.11 76.0576Z" fill="#FFD773"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M194.668 178.076C195.223 177.142 195.23 175.98 194.685 175.04L179.51 148.849C178.965 147.908 177.954 147.336 176.868 147.353L145.675 147.839C144.633 147.855 143.674 148.41 143.142 149.306L127.208 176.125C126.653 177.06 126.647 178.221 127.192 179.161L142.367 205.353C142.911 206.293 143.922 206.865 145.009 206.848L176.201 206.364C177.243 206.348 178.202 205.792 178.734 204.897L194.668 178.076Z" fill="#FFD773"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M256.219 142.413C256.774 141.479 256.78 140.317 256.236 139.377L241.061 113.186C240.516 112.245 239.505 111.673 238.418 111.69L207.226 112.175C206.184 112.192 205.225 112.747 204.693 113.643L188.759 140.462C188.204 141.396 188.198 142.558 188.742 143.498L203.917 169.689C204.462 170.63 205.473 171.202 206.56 171.185L237.752 170.701C238.794 170.685 239.752 170.129 240.285 169.234L256.219 142.413Z" fill="#FFE9B2"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M137.156 145.193C137.712 144.258 137.718 143.097 137.173 142.157L121.998 115.965C121.453 115.025 120.443 114.453 119.356 114.47L88.1631 114.955C87.1214 114.971 86.1627 115.527 85.6306 116.423L69.6966 143.242C69.1414 144.176 69.1351 145.338 69.6799 146.278L84.8548 172.469C85.3996 173.41 86.4104 173.982 87.4971 173.965L118.689 173.481C119.731 173.465 120.69 172.909 121.222 172.013L137.156 145.193Z" fill="#FFD773"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M76.8284 182.121C77.3835 181.187 77.3898 180.025 76.845 179.085L61.6701 152.894C61.1253 151.953 60.1144 151.381 59.0277 151.398L27.8349 151.883C26.7933 151.9 25.8346 152.455 25.3025 153.351L9.36843 180.17C8.8133 181.104 8.80694 182.266 9.35179 183.206L24.5267 209.397C25.0715 210.338 26.0823 210.91 27.169 210.893L58.3613 210.409C59.403 210.393 60.3618 209.837 60.8939 208.942L76.8284 182.121Z" fill="#FFD773"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M77.9143 115.157C78.4694 114.223 78.4758 113.061 77.9309 112.121L62.7561 85.9298C62.2112 84.9894 61.2003 84.4172 60.1136 84.4342L28.9209 84.9196C27.8792 84.9358 26.9205 85.4913 26.3884 86.3869L10.4544 113.206C9.89924 114.141 9.89287 115.302 10.4377 116.242L25.6126 142.434C26.1574 143.374 27.1683 143.946 28.2549 143.929L59.4473 143.445C60.489 143.429 61.4477 142.873 61.9799 141.978L77.9143 115.157Z" fill="#FFE9B2"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Defs>
                        <LinearGradient
                            id="paint0_linear_107_4458"
                            x1={142.411}
                            y1={-19.9033}
                            x2={256.605}
                            y2={214.654}
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop stopColor="#E0C04F" />
                            <Stop offset={1} stopColor="#B16F07" />
                        </LinearGradient>
                    </Defs>
                </Svg>
            </View>
            <View style={{ flex: 1, }}>
                {/* <View style={{ alignItems: 'center' }}> 
                <Image source={require('../assets/img/Group81547.png')} style={styles.logo} />
                <Text style={styles.innerText1}> together - better - faster </Text>
                */}

            <Lottie source={require('../assets/img/splash.json')}
                autoPlay loop={false}
                onAnimationFinish={() => navigation.navigate("LoginScreen")} />

            {/* </View> */}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFAF5',
    },
    logo: {
        // marginStart: '6%',
        width: 200,
        height: 200,
        marginTop: '30%',
        // resizeMode: 'contain',
        // marginBottom: '5%',
        // flex: 1,
        // alignself: 'center',
        resizeMode: 'contain'
    },
    logotext: {
        // marginStart: '6%',
        width: 100,
        height: 200,
        // resizeMode: 'contain',
        // marginBottom: '5%',
        flex: 1,
        resizeMode: 'contain'
    },
    container1: {
        // paddingTop: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    innerText: {
        color: '#123F2F',
        textAlign: 'center', // <-- the magic
        //fontWeight: '600',
        fontSize: 45,
        marginTop: 0,
        fontFamily: 'Millunium-BOLD',
        flex: 1
    },
    innerText1: {
        color: '#123F2F',
        textAlign: 'center', // <-- the magic
        //fontWeight: '300',
        fontSize: 14,
        marginTop: '-15%',
        fontFamily: 'Millunium-BOLD',
    },

    vector: {
        // marginTop: '10%',
        // width: '100%',
    },
});
// export default HomeSplashScreen;
// return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Hibee</Text>
//     </View>
// );
// };

export default Splash;
{/* <Svg
                        width="100%"
                        height="70"
                        viewBox="0 0 1 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <Path
                            d="M60.0402 16.7842L51.6513 2.28004C51.2511 1.58805 50.6762 1.01325 49.9841 0.613131C49.292 0.213011 48.507 0.0015877 47.7076 0H30.9585C30.1596 0.00222466 29.3752 0.213571 28.6833 0.613019C27.9914 1.01247 27.4162 1.58609 27.0148 2.27685L18.6418 16.7842C18.2418 17.4763 18.0313 18.2616 18.0312 19.061C18.0313 19.8604 18.2418 20.6457 18.6418 21.3379L27.0148 35.8516C27.4157 36.5428 27.9908 37.1167 28.6828 37.5163C29.3748 37.9158 30.1595 38.1269 30.9585 38.1284H47.7076C48.5067 38.1272 49.2915 37.9162 49.9835 37.5167C50.6756 37.1171 51.2507 36.543 51.6513 35.8516L60.0402 21.3379C60.4402 20.6457 60.6508 19.8604 60.6508 19.061C60.6508 18.2616 60.4402 17.4763 60.0402 16.7842Z" fill="#FFC022"
                        // stroke="url(#paint0_linear_107_4458)"
                        // strokeWidth={1}
                        />
                        <Path
                            d="M50.0378 45.0387H25.149C24.8175 45.0394 24.4919 44.9508 24.2064 44.7822C23.921 44.6136 23.6862 44.3713 23.5267 44.0807L10.5426 20.4021C10.3863 20.1143 10.1558 19.8737 9.87501 19.7052C9.59422 19.5367 9.27342 19.4466 8.94598 19.4441H1.92064C1.44206 19.4516 0.978401 19.2775 0.62293 18.957C0.267458 18.6365 0.0465467 18.1933 0.00463394 17.7165C-0.0133678 17.4625 0.0212032 17.2075 0.106187 16.9674C0.191171 16.7274 0.324743 16.5074 0.498557 16.3213C0.672371 16.1352 0.882695 15.987 1.11639 15.8858C1.35008 15.7846 1.60212 15.7328 1.85677 15.7334H11.1174C11.4488 15.7334 11.7741 15.8222 12.0595 15.9907C12.3448 16.1592 12.5797 16.4012 12.7397 16.6914L25.7238 40.3668C25.8801 40.6545 26.1106 40.8952 26.3914 41.0636C26.6722 41.2321 26.993 41.3223 27.3204 41.3248H50.0889C50.3427 41.3247 50.5938 41.3767 50.8267 41.4777C51.0595 41.5786 51.2692 41.7264 51.4425 41.9117C51.6159 42.0971 51.7494 42.3161 51.8346 42.5551C51.9198 42.7942 51.9549 43.0482 51.9379 43.3015C51.8984 43.7772 51.6808 44.2205 51.3285 44.5426C50.9761 44.8647 50.5152 45.0419 50.0378 45.0387Z" fill="#12352F"
                            // stroke="url(#paint0_linear_107_4458)"
                            strokeWidth={1}
                        />
                    <Path
                        d="M26.6429 54.5935C28.6182 54.5935 30.2195 52.9922 30.2195 51.017C30.2195 49.0417 28.6182 47.4404 26.6429 47.4404C24.6677 47.4404 23.0664 49.0417 23.0664 51.017C23.0664 52.9922 24.6677 54.5935 26.6429 54.5935Z" fill="#12352F"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Path
                        d="M50.1742 54.5935C52.1495 54.5935 53.7507 52.9922 53.7507 51.017C53.7507 49.0417 52.1495 47.4404 50.1742 47.4404C48.1989 47.4404 46.5977 49.0417 46.5977 51.017C46.5977 52.9922 48.1989 54.5935 50.1742 54.5935Z" fill="#12352F"
                        // stroke="url(#paint0_linear_107_4458)"
                        strokeWidth={1}
                    />
                    <Defs>

                    </Defs>
                    <Text
                        // stroke="#123F2F"
                        fontSize="35"
                        color="#123F2F"
                        fill="#123F2F"
                        x={130}
                        y={40}
                        textAnchor="middle"
                        font={"Millunium-BOLD"}
                    >
                        Hibee
                    </Text>
                    <Text
                        // stroke="#123F2F"
                        fontSize="20"
                        color="#123F2F"
                        fill="#123F2F"
                        x={120}
                        y={100}
                        textAnchor="middle"
                        font={"Millunium-BOLD"}
                    >
                        together - better - faster
                    </Text>
                </Svg>  */}