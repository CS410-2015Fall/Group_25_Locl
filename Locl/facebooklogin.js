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
