'use strict';

var React = require('react-native');
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
var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKGraphRequest,
  FBSDKLoginButton,
  FBSDKLoginManager,
} = FBSDKLogin;

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
            this.loadUserProfile();
          }

        }}
        onLogoutFinished={() => alert('Logged out.')}
        />
        </View>
        );
  }

  loadUserProfile(){
    this.props.navigator.push({
      title: 'User',
      component: UserProfile,
    });
  }
}

module.exports = FB;
