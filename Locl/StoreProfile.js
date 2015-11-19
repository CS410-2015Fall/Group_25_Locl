
'use strict';

var React = require('react-native');
var StorePreferences = require('./StorePreferences');

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

var StoreProfile = React.createClass({
 render(){
   return (<View style={styles.container}>
     <Text style={styles.description}>
     Setup your store page:
     </Text>
     <TouchableHighlight style={styles.button} onPress={this.toStorePreferences}>
     <Text style={styles.buttonText}>Proceed</Text>
     </TouchableHighlight>
     </View>);
 },
 
 toStorePreferences(){
   this.props.navigator.push({
     title: 'StorePreferences',
     component: StorePreferences
   });
 }
 
});

module.exports = StoreProfile;