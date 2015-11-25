'use strict';

var React = require('react-native');
var StoreFBLogin = require('./StoreFBLogin');
var CustomerFBLogin = require('./CustomerFBLogin');
var CustomerHome = require('./CustomerHome');
var StoreHome = require('./StoreHome');
var FBSDKCore = require('react-native-fbsdkcore');

var customer = 'false';

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
  AsyncStorage
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
                               marginLeft: 85,
                               marginTop: 100,
                               marginBottom: 50,
                               },
                               icon:{
                               marginTop: 70,
                               marginLeft: 25
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
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 0,
                               marginBottom: 50,
                               marginLeft: 84
                               },
                               text:{
                               
                               }
                               });

var Preference = React.createClass({
                                    render(){
                                   return (<View style={styles.background}>
                                            <View style={styles.container}>
                                            <Text style={styles.description}>
                                            You are a:
                                            </Text>
                                            <TouchableHighlight style={styles.button} onPress={this.toStoreSetup}>
                                            <Text style={styles.buttonText}>Store</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight style={styles.button} onPress={this.toCustomerList}>
                                            <Text style={styles.buttonText}>Customer</Text>
                                            </TouchableHighlight>
                                            </View>
                                            </View>);
                                    },
                                    
                                    toStoreSetup(){
                                    this.setType('false');
                                   console.log('here');
                                    this.props.navigator.push({
                                                              title: 'Store Setup',
                                                              component: StoreFBLogin
                                                              });
                                    },
                                    
                                    toCustomerList(){
                                    this.setType('true');
                                    this.props.navigator.push({
                                                              title: 'Customer Setup',
                                                              component: CustomerFBLogin
                                                              });
                                    },
                                   
                                   async setType(str){
                                   try{
                                   await AsyncStorage.setItem('customer', str);
                                   var out = await AsyncStorage.getItem('customer');
                                   console.log(out);
                                   
                                   } catch(error) {
                                    console.log(error.message);
                                   }
                                   
                                   },
                                    
                                    });

module.exports = Preference;
