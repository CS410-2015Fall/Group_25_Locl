'use strict';

var React = require('react-native');
var CustomerAdd = require('./CustomerAdd');
var StorePage = require('./StorePage');
var bluetoothScanningManager = require('./bluetoothScanningManager.js');
var cacheManager = require('./cacheManager.js');
var serverManager = require('./serverManager.js');

var {
  AppStateIOS,
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
  ListView,
  DeviceEventEmitter,
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
                               button1: {
                               width: 150,
                               height: 150,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 140,
                               marginBottom: 0,
                               marginLeft: 84
                               },
                               button2: {
                               width: 150,
                               height: 150,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 40,
                               marginBottom: 0,
                               marginLeft: 84
                               },
                               });

var Customer = React.createClass({
                                   render(){
                                   return (<View style={styles.container}>
                                           <TouchableHighlight style={styles.button1} onPress={this.toCustomerAdd}>
                                           <Text style={styles.buttonText}>List</Text>
                                           </TouchableHighlight>
                                            <TouchableHighlight style={styles.button2} onPress={this.toStorePage}>
                                            <Text style={styles.buttonText}>My Profile</Text>
                                            </TouchableHighlight>
                                           </View>);
                                   },
                                   
                                   toCustomerAdd(){
                                     this.props.navigator.push({
                                                               title: 'Shopping List',
                                                               component: CustomerAdd
                                     });
                                   },
                                    
                                     toStorePage(){
                                     this.props.navigator.push({
                                                               title: 'Profile',
                                                               component: StorePage
                                                               });
                                     }
                                   
                                   });

module.exports = Customer;