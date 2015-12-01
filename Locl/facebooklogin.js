'use strict';

var React = require('react-native');
var FBSDKLogin = require('react-native-fbsdklogin');
var FBSDKCore = require('react-native-fbsdkcore');

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

var {
  FBSDKGraphRequest,
  FBSDKLoginButton,
  FBSDKLoginManager,
} = FBSDKLogin;

var {
  FBSDKGraphRequest,
  FBSDKGraphRequestManager,
  FBSDKAccessToken,
} = FBSDKCore;

var styles = StyleSheet.create({
  container: {
   flex: 1,
   alignItems      : 'center',
   backgroundColor : '#8173c7',
   flexDirection: 'column',
   justifyContent: 'space-around',
  },
});

class FB extends React.Component {
  render(){
    return (
      <View style={styles.container}>
      <FBSDKLoginButton 
      onPress= {() => { 
        FBSDKLoginManager.logInWithReadPermissions(['email'],
          (error, result) => {
              })}}
        onLoginFinished={(error, result) => {
          if (result.isCancelled) {
            alert('Login cancelled.');
          } else {
            this.loadUserInfo();
          }
        }}
        onLogoutFinished={() => alert('Logged out.')}
        />
        </View>
        );
  }

  loadUserProfile(informationDict){
    var UserProfile = require('./UserProfile');
    this.props.navigator.replace({
      title: 'Your Profile',
      component: UserProfile,
      passProps: {
        name: informationDict['name'], 
        email: informationDict['email'], 
        picture: informationDict['picture']['data']['url'], 
        id: informationDict['id'], 
        first_name: informationDict['first_name'], 
        last_name: informationDict['last_name']},});
  }

  loadUserInfo() {
    var GraphReq = new FBSDKGraphRequest((error, result) => {
      if (error)
      {
        console.log("Error: ", error);
      }
      else
      {
        this.loadUserProfile(result);
      }
    }, '/me', {fields: { string: 'name, email, picture, first_name, last_name'} });
    FBSDKGraphRequestManager.batchRequests([GraphReq],
      function() {}, 60);
  }
}

module.exports = FB;
