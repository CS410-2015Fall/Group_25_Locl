/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} = React;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKGraphRequest,
  FBSDKLoginButton
} = FBSDKLogin;

var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKAccessToken,
} = FBSDKCore;

//FBSDKAccessToken.getCurrentAccessToken(token => console.log(token));

var loclIOS = React.createClass({
  render: function() {
    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>
        Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
        To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
        Press Cmd+R to reload,{'\n'}
        Cmd+D or shake for dev menu
        </Text>
        <FBSDKLoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            alert('Error logging in.');
          } else {
            if (result.isCanceled) {
              alert('Login cancelled.');
            } else {
              alert('Logged in.');
            }
          }
        }}
    onLogoutFinished={() => alert('Logged out.')}
    readPermissions={[]}
    publishPermissions={['publish_actions']}/>
      <TouchableHighlight onPress={this._onPressButton}>
      <Text>
      Get credentials 
      </Text>
      </TouchableHighlight>
      </View>
      );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('loclIOS', () => loclIOS);
