'use strict';

var React = require('react-native');
var StoreFBLogin = require('./StoreFBLogin');
var CustomerFBLogin = require('./CustomerFBLogin');
var CustomerHome = require('./CustomerHome');
var StoreHome = require('./StoreHome');
var FBSDKCore = require('react-native-fbsdkcore');

var Storage = require('react-native-store');

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
  AppRegistry,
  AsyncStorage
} = React;

var {
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
    margin: 80
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

var Preference = React.createClass({
  render(){
    return (<View style={styles.container}>
      <Text style={styles.description}>
      You are a:
      </Text>
      <TouchableHighlight style={styles.button} onPress={this.toStoreSetup}>
      <Text style={styles.buttonText}>Store</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.button} onPress={this.toCustomerList}>
      <Text style={styles.buttonText}>Customer</Text>
      </TouchableHighlight>
      </View>);
  },

  async toStoreSetup(){
                                   try {
                                   var dingus = await this.setBoolean(false);
                                   } catch(error){
                                   console.log("store");
                                   }
    FBSDKAccessToken.getCurrentAccessToken(token =>
    {
      if (token == null) {
        this.props.navigator.popN(2);
      } else {
                                           this.props.navigator.popToTop();
                                           /*this.props.navigator.resetTo({
                                                                        title: 'Locl',
                                                                        component: StoreHome,
                                                                        });*/
      }
    });
  },

  async toCustomerList(){
                                   try {
                                   var dingus = await this.setBoolean(true);
                                   } catch(error){
                                   console.log("customer");
                                   }
    FBSDKAccessToken.getCurrentAccessToken(token =>
    {
      if (token == null) {
        this.props.navigator.popN(2);
      } else {

                                           this.props.navigator.popToTop();
                                           /*this.props.navigator.resetTo({
                                                                        title: 'Locl',
                                                                        component: CustomerHome,
                                                                        });*/
      }
    });
  },
                                   
                                   async setBoolean(customer){
                                  /* RNS version */
                                   var boolModel = await Storage.model("status");
                                   
                                   if(!customer){
                                   console.log("Choosing Store");
                                   var add_store = await boolModel.add({name: "store"});
                                   return true;
                                   } else{
                                   console.log("Choosing Customer");
                                   var add_customer = await boolModel.add({name: "customer"});
                                   return true;
                                   }
                                   
                                   
                                   /* AS version
                                   try {
                                   if (customer){
                                   await AsyncStorage.setItem("status", "customer");
                                   return true;
                                   } else {
                                   await AsyncStorage.setItem("status", "store");
                                   }
                                   } catch (error){
                                   console.log("Error with choosing");
                                   return false;
                                   }
                                    */
                                   },
                                   

});

module.exports = Preference;
