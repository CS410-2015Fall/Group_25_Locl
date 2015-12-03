'use strict';

var React = require('react-native');
var StorePage = require('./StorePage');
var FacebookLogin = require('./facebooklogin');
var Swiper = require('react-native-swiper');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  NavigatorIOS,
  AppRegistry,
  AlertIOS,
  ListView,
  DeviceEventEmitter,
  ScrollView, 
  AsyncStorage,
} = React;

var styles = StyleSheet.create({
 container: {
   flex: 1,
   paddingTop: 10,
   alignItems      : 'center',
   backgroundColor : '#8173c7',
   flexDirection: 'column',
   justifyContent: 'space-around',
 },
 tutorialScreen: {
   borderColor : '#F5F5F5',
   justifyContent : 'center',
   alignItems     : 'center',
   padding        : 10,
   borderWidth    : 2,
   borderRadius   : 5,
   marginLeft: 80,
   marginRight: 80,
   flexWrap: 'wrap',
 },
 buttonText: {
   color: 'F5F5F5',
   fontSize: 18,
   alignSelf: 'center'
 },
 buttonBox : {
   borderColor : '#F5F5F5',
   justifyContent : 'center',
   alignItems     : 'center',
   padding  : 10,
   borderWidth    : 2,
   borderRadius   : 5
 },
 wrapper: {
 },
 slide1: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#8173c7',
},
slide2: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#97CAE5',
},
slide3: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#92BBD9',
},
slide4: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#8173c1',
},
text: {
  color: '#fff',
  fontSize: 30,
  fontWeight: 'bold',
  paddingBottom: 10
},
icon: {
  alignSelf: 'center',
  height: 50,
  width: 100,
  resizeMode: 'stretch',
},
customTabBar: {
  flexDirection: 'row',
  padding: 10,
  alignItems      : 'center',
  backgroundColor : '#8173c7',
  justifyContent: 'space-around',
  alignItems: 'flex-end',
},
customTab: {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around'
},
tabBarIcon: {
  height: 40,
  width: 40,
  resizeMode: 'stretch',
},

});

var Tutorial = React.createClass({
 render(){
   return (
    <View style={styles.container}>
    <Swiper style={styles.wrapper} loop={false}>
    <View style={styles.slide1}>
    <Text style={styles.text}>Welcome to</Text>
    <Image style={styles.icon} source={require('image!LoclIcon')} /> 
    </View>
    <View style={styles.slide2}>
    <Text style={styles.text}>Locl is really easy to use.</Text>
    </View>
    <View style={styles.slide3}>
    <Text style={styles.text}>More instructions!</Text>
    </View>
    <View style={styles.slide4}>
    <TouchableHighlight underlayColor="#AA9999" onPress={this.toFacebookLogin}>
    <View style={styles.buttonBox}>
    <Text style={styles.buttonText}>
    Got it
    </Text>
    </View>
    </TouchableHighlight>
    </View>
    </Swiper>
    </View>);
 },

 async setTutorialCompleted() {
    try {
      await AsyncStorage.setItem('tutorialCompleted', 'true');
      console.log('Tutorial set to completed');
    } catch (error) {
      console.log('AsyncStorage error (setTutorialTrue): ' + error.message);
    }
  },

 toFacebookLogin(){
    this.setTutorialCompleted().done();
    this.props.navigator.replace({
     title: "Login with Facebook",
     component: FacebookLogin
   });
 }
 
});

module.exports = Tutorial;
