'use strict';

var React = require('react-native');
var CustomerAdd = require('./CustomerAdd');
var StorePage = require('./StorePage');
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

var CustomerHome = React.createClass({
                                   render(){
                                   return (<View style={styles.container}>
                                           <Text style={styles.description}>
                                           Your list:
                                           </Text>
                                           <TouchableHighlight style={styles.button} onPress={this.toCustomerAdd}>
                                           <Text style={styles.buttonText}>Items</Text>
                                           </TouchableHighlight>
                                            <TouchableHighlight style={styles.button} onPress={this.toStorePage}>
                                            <Text style={styles.buttonText}>Store Page</Text>
                                            </TouchableHighlight>
                                           </View>);
                                   },
                                   
                                   toCustomerAdd(){
                                     this.props.navigator.push({
                                                               title: 'CustomerAdd',
                                                               component: CustomerAdd
                                     });
                                   },
                                    
                                     toStorePage(){
                                     this.props.navigator.push({
                                                               title: 'StorePage',
                                                               component: StorePage
                                                               });
                                     }
                                   
                                   });

module.exports = CustomerHome;