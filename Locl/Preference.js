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
                               marginLeft: 85,
                               marginTop: 100,
                               marginBottom: 50,
                               },
                               icon:{
                               marginTop: 70,
                               marginLeft: 25
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
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 0,
                               marginBottom: 40,
                               marginLeft: 84
                               },
                               text:{
                               
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
                                   try {
                                   var boolModel = await Storage.model("s");
                                   var add_intro = await boolModel.add({name: "i"});
                                   } catch(error){
                                   console.log("store");
                                   }
    FBSDKAccessToken.getCurrentAccessToken(token =>
    {
      if (token == null) {
        this.props.navigator.popN(2);
      } else {
                                           this.props.navigator.popToTop();
                                           /*this.props.navigator.replace({
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
                                   try {
                                   var boolModel = await Storage.model("s");
                                   var add_intro = await boolModel.add({name: "i"});
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
                                                                        component: CustomerHome,
                                                                        });*/
      }
    });
  },
                                   
                                   async setBoolean(customer){
                                  /* RNS version */
                                   var boolModel = await Storage.model("s");
                                   
                                   if(!customer){
                                   console.log("Choosing Store");
                                   var add_store = await boolModel.add({name: "s"});
                                   return true;
                                   } else{
                                   console.log("Choosing Customer");
                                   var add_customer = await boolModel.add({name: "c"});
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
