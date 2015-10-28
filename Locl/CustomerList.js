'use strict';

var React = require('react-native');
var CustomerAdd = require('./CustomerAdd');
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

var styles = StyleSheet.create({
                               description: {
                               color: 'black',
                               backgroundColor: 'white',
                               fontSize: 30,
                               margin: 80
                               },
                               container: {
                               flex: 1,
                               margin: 80
                               },
                               flowRight: {
                               flexDirection: 'column',
                               alignItems: 'center',
                               alignSelf: 'stretch'
                               },
                               buttonText: {
                               fontSize: 18,
                               color: 'white',
                               alignSelf: 'center'
                               },
                               button: {
                               height: 20,
                               flex: 1,
                               flexDirection: 'row',
                               backgroundColor: '#48BBEC',
                               borderColor: '#48BBEC',
                               borderWidth: 1,
                               borderRadius: 8,
                               marginBottom: 10,
                               alignSelf: 'stretch',
                               justifyContent: 'center'
                               }
                               });

var CustomerList = React.createClass({
                                   render(){
                                   return (<View style={styles.container}>
                                           <Text style={styles.description}>
                                           Your list:
                                           </Text>
                                           <TouchableHighlight style={styles.button} onPress={this.toCustomerAdd}>
                                           <Text style={styles.buttonText}>Customer</Text>
                                           </TouchableHighlight>
                                            <TouchableHighlight style={styles.button} onPress={this.range}>
                                            <Text style={styles.buttonText}>Bluetooth</Text>
                                            </TouchableHighlight>
                                           </View>);
                                   },
                                   
                                   toCustomerAdd(){
                                     this.props.navigator.push({
                                                               title: 'CustomerAdd',
                                                               component: CustomerAdd
                                     });
                                   },
                                    
                                   range(){
                                     if (!bt){
                                      console.log('bluetooth on');
                                      bt = true;
                                     } else {
                                      console.log('bluetooth off');
                                      bt = false;
                                     }
                                   }
                                   
                                   });

module.exports = CustomerList;