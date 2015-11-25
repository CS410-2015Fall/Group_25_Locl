'use strict'

var React = require('react-native');
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
                               color: TEXT,
                               backgroundColor: BACKGROUND,
                               fontSize: 30,
                               margin: 80
                               },
                               background:{
                               backgroundColor: BACKGROUND,
                              
                               },
                               container: {
                               backgroundColor: BACKGROUND,
                               flex: 1,
                               margin: 80,
                               width:null,
                               height: null
                               },
                               flowRight: {
                               flexDirection: 'column',
                               alignItems: 'center',
                               alignSelf: 'stretch'
                               },
                               buttonText: {
                               fontSize: 18,
                               color: TEXT,
                               alignSelf: 'center'
                               },
                               button: {
                               height: 20,
                               flex: 1,
                               flexDirection: 'row',
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 8,
                               marginBottom: 10,
                               alignSelf: 'stretch',
                               justifyContent: 'center'
                               }
                               });


module.exports = styles