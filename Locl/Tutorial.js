'use strict';

var React = require('react-native');
var StorePage = require('./StorePage');
var FacebookLogin = require('./facebooklogin');

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
  AsyncStorage
} = React;

var BACKGROUND = '#a2ee6c';
var TEXT = '#effde4';
var BUTTON = '#7cca44';
var OUTLINE = '#d4f7bb';

var styles = StyleSheet.create({
                               description: {
                               color: TEXT,
                               backgroundColor: BACKGROUND,
                               fontSize: 24,
                               margin: 80,
                               fontFamily: 'Avenir',
                               textAlign: 'center',
                               marginTop: 120
                               },
                               container: {
                               flex: 2,
                               alignItems      : 'center',
                               backgroundColor : '#F5FCFF',
                               paddingTop      : 0,
                               backgroundColor: BACKGROUND
                               },
                               buttonText: {
                               fontSize: 18,
                               color: TEXT,
                               fontFamily: 'Avenir',
                               alignSelf: 'center'
                               },
                               button: {
                               height: 60,
                               width: 80,
                               flex: 1,
                               flexDirection: 'row',
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 3,
                               borderRadius: 8,
                               marginBottom: 10,
                               alignSelf: 'stretch',
                               justifyContent: 'center'
                               },

                               });

var Tutorial = React.createClass({
 render(){
   return (
    <View style={styles.container}>
    <Text style={styles.description}>
    Welcome to Locl, the app for all your local shopping needs. First, set up your account.
    </Text>
    <TouchableHighlight onPress={this.toFacebookLogin}>
     <View style={[styles.button, styles.setButtonBox]}>
     <Text style={styles.buttonText}>
     Begin
     </Text>
     </View>
     </TouchableHighlight>
    </View>);
 },

 toFacebookLogin(){
   this.props.navigator.push({
     title: 'Facebook',
     component: FacebookLogin
   });
 }

 
});

  module.exports = Tutorial;
