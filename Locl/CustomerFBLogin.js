'use strict';

var React = require('react-native');
var CustomerProfile = require('./CustomerProfile');
var FBSDKLogin = require('react-native-fbsdklogin');

//Related code to FBSDKCore is only needed for graph requests
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

var CustomerFBLogin = React.createClass({
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
              this.loadCustomerProfile();
            }

          }}
          onLogoutFinished={() => alert('Logged out.')}
          />
        </View>
        );
  },

  loadCustomerProfile(){
    this.props.navigator.push({
      title: 'CustomerProfile',
      component: CustomerProfile,
    });

  }
});

module.exports = CustomerFBLogin;
