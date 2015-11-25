
'use strict';

var React = require('react-native');
var CustomerPreferences = require('./CustomerPreferences');

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
                               fontSize: 24,
                               marginLeft: 40,
                               marginTop: 15,
                               },
                               icon:{
                               marginTop: 90,
                               marginLeft: 40,
                               borderWidth: 4,
                               borderColor: OUTLINE,
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
                               marginTop: 30,
                               marginBottom: 50,
                               marginLeft: 84
                               },
                               text:{
                               
                               }
                               });


var CustomerProfile = React.createClass({
                                   render(){
                                        return (<View style={styles.container}>
                                                <Image
                                                style={styles.icon}
                                                source={require('image!matthew')}
                                                />
                                                <Text style={styles.description}>
                                                Matthew
                                                </Text>
                                                <Text style={styles.description}>
                                                Dallas
                                                </Text>
                                                <TouchableHighlight style={styles.button} onPress={this.toCustomerPreferences}>
                                                <Text style={styles.buttonText}>Proceed</Text>
                                                </TouchableHighlight>
                                                </View>);
                                   },
                                   
                                   toCustomerPreferences(){
                                   this.props.navigator.push({
                                                             title: 'Add Shopping List',
                                                             component: CustomerPreferences
                                                             });
                                   }
                                   
                                   });

module.exports = CustomerProfile;