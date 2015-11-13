'use strict';

var React = require('react-native');
var login = require('./facebooklogin');

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginManager,
} = FBSDKLogin;

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
  container: {
    flex            : 1,
    alignItems      : 'center',
    backgroundColor : '#F5FCFF',
    paddingTop      : 30
  },
  instructionsText : {
    fontSize : 20
  },
  separator : {
    borderWidth  : .5,
    borderColor  : '#AEAEAE',
    height       : 1,
    width        : 300,
    marginBottom : 25
  },
  labelContainer : {
    flexDirection  : 'row',
    width          : 300
  },
  labelText : {
    paddingRight : 10,
    fontSize     : 18
  },
  textInput : {
    height      : 26,
    borderWidth : 0.5,
    borderColor : '#0f0f0f',
    padding     : 4,
    flex        : 1,
    fontSize    : 13,
  },
  buttonContainer : {
    flexDirection  : 'row',
    justifyContent : 'center',
    alignItems     : 'center',
    marginTop      : 20
  },
  touchableHighlight : {
    marginLeft  : 10,
    marginRight : 10,
  },
  buttonBox : {
    flexDirection  : 'row',
    justifyContent : 'center',
    alignItems     : 'center',
    padding        : 10,
    borderWidth    : 2,
    borderRadius   : 5
  },
  saveButtonBox : {
    borderColor : '#AA0000'
  },
  loadButtonBox : {
    borderColor : '#00AA00'
  },
  setButtonBox : {
    borderColor : '#00AA00'
  },
  buttonText : {
    fontSize : 16,
  },
  outputContainer : {
    width          : 300,
    height         : 200,
    justifyContent : 'center',
    alignItems     : 'center',
    borderWidth    : .5,
    borderColor    : "#999999",
    marginTop      : 20
  }, 
  row: {
    padding: 8,
    paddingBottom: 16
  }, 
  smallText: {
    fontSize: 11
  },
  formInput: {
    flex: 1,
    height: 26,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#555555",
  },
  saved: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },

  description: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1,
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

var Locl = React.createClass({
  render() {
    return (
        <NavigatorIOS ref='nav'
        style={styles.container}
        initialRoute={{
          title: 'Locl',
          component: login,
        }}/>
        );
  }
});

//To check if is logged in
login.isLoggedIn( result => {  
  console.log(result);
});

AppRegistry.registerComponent('Locl', () => Locl);
