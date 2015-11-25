'use strict';

var React = require('react-native');
var StoreProfile = require('./StoreProfile');

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
  AppRegistry
} = React;


var BACKGROUND = '#a2ee6c';
var TEXT = '#effde4';
var BUTTON = '#7cca44';
var OUTLINE = '#d4f7bb';

var styles = StyleSheet.create({
                               description: {
                               fontFamily: 'Avenir',
                               color: TEXT,
                               backgroundColor: BACKGROUND,
                               fontSize: 30,
                               marginLeft: 55,
                               marginTop: 200,
                               marginBottom: 50,
                               },
                               icon:{
                               marginTop: 25,
                               marginLeft: 20
                               },
                               container: {
                               flex: 1,
                               backgroundColor: BACKGROUND,
                               },
                               flowRight: {
                               flexDirection: 'column',
                               alignItems: 'center',
                               alignSelf: 'stretch'
                               },
                               buttonText: {
                               marginTop: 40,
                               fontSize: 24,
                               color: TEXT,
                               alignSelf: 'center'
                               },
                               button: {
                               width: 150,
                               height: 150,
                               backgroundColor: '#3b5998',
                               borderColor: 'white',
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 0,
                               marginBottom: 50,
                               marginLeft: 84
                               },
                               text:{
                               
                               }
                               });


var StoreFBLogin = React.createClass({
                           render(){
                           return (<View style={styles.container}>
                                   <Text style={styles.description}>
                                   Facebook Login
                                   </Text>
                                   <TouchableHighlight style={styles.button} onPress={this.loadStoreProfile}>
                                   <Image
                                   style={styles.icon}
                                   source={require('image!fb_logo')}
                                   />
                                   </TouchableHighlight>
                                   </View>
                                   );
                           },
                           
                           loadStoreProfile(){
                           this.props.navigator.push({
                                                     title: 'Profile',
                                                     component: StoreProfile,
                                                     });
                           
                           }
                           
                           
                           });

module.exports = StoreFBLogin;
