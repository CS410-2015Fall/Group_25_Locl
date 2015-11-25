'use strict';

var React = require('react-native');
var StoreProfile = require('./StoreProfile');
var FBSDKLogin = require('react-native-fbsdklogin');

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
                               fontSize: 30,
                               marginLeft: 55,
                               marginTop: 200,
                               marginBottom: 50,
                               },
                               icon:{
                               marginTop: 25,
                               marginLeft: 20
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
                               backgroundColor: '#3b5998',
                               borderColor: 'white',
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 0,
                               marginBottom: 50,
                               marginLeft: 84
                               },
                               text:{
                               
                               }
                               });
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

var StoreFBLogin = React.createClass({

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
              this.loadStoreProfile();
            }

          }}
          onLogoutFinished={() => alert('Logged out.')}
          />
        </View>
        );
  },

  loadStoreProfile(){
    this.props.navigator.push({
      title: 'Profile',
      component: StoreProfile,
    });

  }


});

module.exports = StoreFBLogin;
