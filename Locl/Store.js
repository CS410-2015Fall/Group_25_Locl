'use strict';

var React = require('react-native');
var StoreAdd = require('./StoreAdd');
var StorePage = require('./StorePage');
//var Beacon = require('./Beacon');
var bt = false;

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
                               marginLeft: 85,
                               marginTop: 100,
                               marginBottom: 50,
                               },
                               icon:{
                               marginTop: 17.5,
                               marginLeft: 22.5
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
                               marginTop: 24,
                               fontSize: 15,
                               color: TEXT,
                               alignSelf: 'center'
                               },
                               button1: {
                               width: 100,
                               height: 100,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 120,
                               marginBottom: 0,
                               marginLeft: 110
                               },
                               button2: {
                               width: 100,
                               height: 100,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 40,
                               marginBottom: 0,
                               marginLeft: 110
                               },
                               button3: {
                               width: 100,
                               height: 100,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 40,
                               marginBottom: 0,
                               marginLeft: 110
                               },
                               
                               pressedbutton3: {
                               width: 100,
                               height: 100,
                               backgroundColor: '#499711',
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 40,
                               marginBottom: 0,
                               marginLeft: 110
                               },
                               });

var Store = React.createClass({
                                  
                                  getInitialState: function() {
                                  return { pressed: false }
                                  },
                                  
                                   render(){
                                   return (<View style={styles.container}>
                                           <TouchableHighlight style={styles.button1} onPress={this.toStoreAdd}>
                                           <Text style={styles.buttonText}>Inventory</Text>
                                           </TouchableHighlight>
                                           <TouchableHighlight style={styles.button2} onPress={this.toStorePage}>
                                           <Text style={styles.buttonText}>Profile</Text>
                                           </TouchableHighlight>
                                           <TouchableHighlight style={this.pressColor()} onPress={this.toBeacon}>
                                           <Image
                                           style={styles.icon}
                                           source={require('image!bluetooth')}
                                           />
                                           </TouchableHighlight>
                                           </View>);
                                   },
                                   
                                   toStoreAdd(){
                                    this.props.navigator.push({
                                                              title: 'Inventory',
                                                              component: StoreAdd
                                                              });
                                  
                                   },
                                  toBeacon(){
                                  this.setState({pressIn: !this.state.pressIn});
                                  
                                  },
                                  
                                  pressColor: function() {
                                  if (this.state.pressIn) {
                                  return styles.pressedbutton3
                                  } else {
                                  return styles.button3
                                  }
                                  },
                                  
                                  toStorePage(){
                                  this.props.navigator.push({
                                                            title: 'Profile',
                                                            component: StorePage
                                                            });
                                  }
                                  
                                   });

module.exports = Store;