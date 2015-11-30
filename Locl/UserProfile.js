'use strict';

var React = require('react-native');
var PreferenceProfile = require('./PreferenceProfile.js');

//app Name for DreamFactory
var loclSQL="?app_name=loclSQL";

//Basic Connection HTMLstrig for Database
var httpString="http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/";

//String to connect to Items Table
var itemTableURL=httpString+"item"+loclSQL;

//String to connect to Customer Table
var customerTableURL=httpString+"customer"+loclSQL;

//Sting to connect to Store Table
var storeTableURL=httpString+"store"+loclSQL;

//String to connect to CustomerItem Table
var customerItemURL=httpString+"customer-items"+loclSQL;

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
  AsyncStorage,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  description: {
    color: 'white',
    backgroundColor: '8173c7',
    fontSize: 18,
  },
  container: {
    flex: 1,
    paddingTop: 150,
    alignItems      : 'center',
    backgroundColor : '#8173c7',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  buttonText: {
   color: 'F5F5F5',
   fontSize: 18,
   alignSelf: 'center'
 },
 buttonBox : {
   borderColor : '#F5F5F5',
   justifyContent : 'center',
   alignItems     : 'center',
   padding        : 10,
   borderWidth    : 2,
   borderRadius   : 5
 },
 profilePicture: {
  height: 125,
  width: 125
}
});

var UserProfile = React.createClass({
  render(){
    return (
      <View style={styles.container}>
      <Image style={styles.profilePicture}
      resizeMode = {'stretch'} source={{uri: this.props.picture}}
      />
      <Text style={styles.description}>
      {this.props.name}
      </Text>
      <Text style={styles.description}>
      {this.props.email}
      </Text>
      <TouchableHighlight style={styles.buttonBox} onPress={this.toFinishTutorial}>
      <Text style={styles.buttonText}>Proceed</Text>
      </TouchableHighlight>
      </View>
      );
  },

  async setTutorialCompleted() {
    try {
      await AsyncStorage.setItem('tutorialCompleted', 'true');
      console.log('Tutorial set to completed');
    } catch (error) {
      console.log('AsyncStorage error (setTutorialTrue): ' + error.message);
    }
  },

  async storeCustomerID(CustomerID) {
    try {
      await AsyncStorage.setItem('CustomerID', CustomerID.toString());
      console.log('CustomerID ' + CustomerID + ' Stored');
    } catch (error) {
      console.log('AsyncStorage error (storeCustomerID): ' + error.message);
    }
  },

  toFinishTutorial(){
    this.createCustomer(this.props.first_name, this.props.last_name, this.props.id);
    this.setTutorialCompleted().done();
    AlertIOS.alert(
      'Would you like to setup a store?',
      null,
      [{text: 'Later', onPress: this.toCustomerHome}, {text: 'Sure', onPress: this.toStoreSetup},]
      )
  },

  toCustomerHome() {
    var CustomerHome = require('./CustomerHome.js')
    this.props.navigator.replace({
      title: "Shopping",
      component: CustomerHome, 
    });
  },

  toStoreSetup() {
    var StoreProfile = require('./StoreProfile.js')
    this.props.navigator.replace({
      title: "Setup a New Store",
      component: StoreProfile,
    });
  },

  createCustomer(fName, lName, pass) {
    fetch(customerTableURL, {method: "POST", body: JSON.stringify({FirstName:fName, LastName: lName, Password:pass})})
    .then((response) => response.json())
    .then((responseData) => {
      console.log("New User Created with ID: " + responseData.CustomerID);
      this.storeCustomerID(responseData.CustomerID);
    })
    .done();
  },

});

module.exports = UserProfile;
