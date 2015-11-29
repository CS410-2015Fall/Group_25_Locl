'use strict';

var React = require('react-native');
var FBSDKLogin = require('react-native-fbsdklogin');
var FBSDKCore = require('react-native-fbsdkcore');
var UserProfile = require('./UserProfile');

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

var BACKGROUND = '#a2ee6c';
var TEXT = '#effde4';
var BUTTON = '#7cca44';
var OUTLINE = '#d4f7bb';

var styles = StyleSheet.create({
  description: {
    color: TEXT,
    backgroundColor: BACKGROUND,
    fontSize: 30,
    margin: 80,
    fontFamily: 'Avenir',
    textAlign: 'center',
    marginTop: 120
  },
  container: {
    flex: 1,
    alignItems      : 'center',
    backgroundColor : '#F5FCFF',
    paddingTop      : 30,
    backgroundColor: BACKGROUND
  }
});


class FB extends React.Component {
  render(){
    return (<View style={styles.container}>
        <Text style={styles.description}>
        To begin, login with Facebook
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
              this.loadUserInfo();
            }

          }}
          onLogoutFinished={() => alert('Logged out.')}
          />
          </View>
          );
  }

  loadUserProfile(informationDict){
    console.log(informationDict['picture']['data']['url']);
    this.props.navigator.push({
      title: 'User',
      component: UserProfile,
      passProps: {name: informationDict['name'], email: informationDict['email'], picture: informationDict['picture']['data']['url'], id: informationDict['id'], first_name: informationDict['first_name'], last_name: informationDict['last_name']},});
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
    }, '/me', {fields: { string: 'name,email,picture,first_name,last_name'} });
    FBSDKGraphRequestManager.batchRequests([GraphReq],
        function() {}, 60);
  }
}

module.exports = FB;
