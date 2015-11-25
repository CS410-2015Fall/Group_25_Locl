'use strict';

var React = require('react-native');
var CustomerProfile = require('./CustomerProfile');
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

var {
  FBSDKGraphRequest,
  FBSDKLoginButton,
  FBSDKLoginManager,
} = FBSDKLogin;

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

var CustomerFBLogin = React.createClass({
                           render(){
                           return (<View style={styles.container}>
                                   <Text style={styles.description}>
                                   FaceBook Login
                                   </Text>
                                   <TouchableHighlight style={styles.button} onPress={this.loadCustomerProfile}>
                                   <Image
                                   style={styles.icon}
                                   source={require('image!fb_logo')}
                                   />
                                   </TouchableHighlight>
                                   </View>
                                   );
                           },
                           
                           loadCustomerProfile(){
                           this.props.navigator.push({
                                                     title: 'Profile',
                                                     component: CustomerProfile,
                                                     });
                           
                           }
                           
                           
                           });


var CustomerFBLogin = React.createClass({
                                        
  // Does it render right?

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
