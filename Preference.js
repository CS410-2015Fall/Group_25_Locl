'use strict';

var React = require('react-native');
var StoreFBLogin = require('./StoreFBLogin');
var CustomerFBLogin = require('./CustomerFBLogin');

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

var Preference = React.createClass({
                                    render(){
                                    return (<View style={styles.container}>
                                            <Text style={styles.description}>
                                            You are a:
                                            </Text>
                                            <TouchableHighlight style={styles.button} onPress={this.toStoreSetup}>
                                            <Text style={styles.buttonText}>Store</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight style={styles.button} onPress={this.toCustomerList}>
                                            <Text style={styles.buttonText}>Customer</Text>
                                            </TouchableHighlight>
                                            </View>);
                                    },
                                    
                                    toStoreSetup(){
                                    this.props.navigator.push({
                                                              title: 'StoreFBLogin',
                                                              component: StoreFBLogin
                                                              });
                                    },
                                    
                                    toCustomerList(){
                                    this.props.navigator.push({
                                                              title: 'CustomerFBLogin',
                                                              component: CustomerFBLogin
                                                              });
                                    }
                                    
                                    });

module.exports = Preference;