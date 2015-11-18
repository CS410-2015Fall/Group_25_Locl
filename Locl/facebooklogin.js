'use strict';

var React = require('react-native');
var Preferences = require('./Preferences');

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
var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKGraphRequest,
  FBSDKLoginButton,
  FBSDKLoginManager,
} = FBSDKLogin;

var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKGraphRequest,
  FBSDKGraphRequestManager,
  FBSDKAccessToken,
} = FBSDKCore;

var fetchFriends = new FBSDKGraphRequest((error, result) => {
  if (error)
  {
    console.log("Error: ", error);
  }
  else
  {
    console.log(result);
  }
}, '/me', {fields: { string: 'name,gender,email'} });

FBSDKGraphRequestManager.batchRequests([fetchFriends],
    function() {}, 60);

var styles = StyleSheet.create({
  description: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1,
    alignItems      : 'center',
    backgroundColor : '#F5FCFF',
    paddingTop      : 30
  }
});

class FB extends React.Component {
  render(){
    return (<View style={styles.container}>
        <Text style={styles.description}>
        FaceBook Login
        </Text>
        <FBSDKLoginButton 
        onPress= {() => { 
          FBSDKLoginManager.logInWithReadPermissions(['email'],
              (error, result) => {
                //call back not called. uses onloginfinished instead
              })}}
          onLoginFinished={(error, result) => {
            if (result.isCancelled) {
              alert('Login cancelled.');
            } else {
              alert('Logged in.');
            }

          }}
          onLogoutFinished={() => alert('Logged out.')}
          />
          </View>
          );
  }

  loadPreferences(){
    this.props.navigator.push({
      title: 'Preferences',
      component: Preferences,
    });
  }

  static isLoggedIn(callback: (result: boolean) => void) {
    FBSDKAccessToken.getCurrentAccessToken(token =>
        {
          if (token == null) {
            callback(false);
          } else {
            callback(true);
          }});
  }
}

module.exports = FB;
