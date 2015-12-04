'use strict';

var React = require('react-native');
var PreferenceProfile = require('./PreferenceProfile.js');
var bluetoothBeaconManager = require('./bluetoothBeaconManager');

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
    backgroundColor: '#8173c7',
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
      source={{uri: this.props.picture}}
      />
      <Text style={styles.description}>
      {this.props.name}
      </Text>
      <Text style={styles.description}>
      {this.props.email}
      </Text>
      <TouchableHighlight style={styles.buttonBox} onPress={this.toFork}>
      <Text style={styles.buttonText}>Proceed</Text>
      </TouchableHighlight>
      </View>
      );
  },

  getInitialState: function() {
    return {
      customerId: "",
      storeId: "",
      hasStoreID: false,
      hasCustomerID: false,
      loading: false,
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

  componentDidMount: function() {
    this.getCustomerHistory(this.props.first_name, this.props.last_name, this.props.id);
  },

  toFork(){
    if (this.state.loading === true) {
      console.log("Made it past loading");
      if(this.state.hasStoreID === false) {
        AlertIOS.alert(
          'Would you like to setup a store?',
          null,
          [{text: 'Later', onPress: this.toCustomerHome}, 
          {text: 'Sure', onPress: this.toStoreSetup},]
          );
      } else {
        this.toCustomerHome()
      }
    }
  },

  toCustomerHome() {
    var CustomerHome = require('./CustomerHome.js')
    if (this.state.hasStoreID === true) {
      console.log("toCustomerHome made it past hasStoreID with storeID: " + this.state.storeId);
      this.props.navigator.replace({
        title: "Shopping",
        component: CustomerHome, 
        passProps: {CustomerID: this.state.customerId, StoreID: this.state.storeId,}
      });
    } else {
    this.props.navigator.replace({
      title: "Shopping",
      component: CustomerHome, 
      passProps: {CustomerID: this.state.customerId,}
    });
  }
  },

  toStoreSetup() {
    var StoreProfile = require('./StoreProfile.js')
    this.props.navigator.replace({
      title: "Setup a New Store",
      component: StoreProfile,
      passProps: {CustomerId: this.state.customerId,}
    });
  },

  getCustomerHistory: function(fName,lName,pass) {  
    console.log("Getting Customer History with: " + fName + " " + lName + " " + pass);

    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer?app_name=loclSQL&filter=firstname%3D%22"+fName+"%22%20and%20lastname%3D%22"+lName+"%22%20and%20password%3D"+pass, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {

      if (responseData.record.length === 0) {
        console.log("Customer does not have a prior account.");
        this.createCustomer(this.props.first_name, this.props.last_name, this.props.id);
        this.setState({
            loading: true, 
          })


      } else {
        
        console.log("Customer has a prior account with ID: " + responseData.record[0].CustomerID);
        this.storeCustomerID(responseData.record[0].CustomerID);
        this.setState({
          customerId: responseData.record[0].CustomerID.toString(),
          hasCustomerID: true,
        })
        
        console.log("customerId set to: " + this.state.customerId + " hasCustomerId set to: " + this.state.hasCustomerID);
        
        if (responseData.record[0].StoreID !== null) {
          console.log("StoreID found associated with customer: " + responseData.record[0].StoreID);
          this.storeStoreID(responseData.record[0].StoreID);
          this.setState({
            storeId: responseData.record[0].StoreID.toString(),
            hasStoreID: true,
            loading: true, 
          })
          bluetoothBeaconManager.onBeaconingSetPress(responseData.record[0].StoreID.toString());
          console.log("storeID set to: " + this.state.storeId + " hasStoreId set to: " + this.state.hasStoreID);
        } else {
          this.setState({
            loading: true, 
          })
        }
      }
    }
    )
.done();
},

async storeStoreID(newStoreID) {
  try {
    await AsyncStorage.setItem('StoreID', newStoreID.toString());
    console.log('StoreID ' + newStoreID + ' newStoreID');
  } catch (error) {
    console.log('AsyncStorage error (storeStoreID): ' + error.message);
  }
},

createCustomer(fName, lName, pass) {
  fetch(customerTableURL, {method: "POST", body: JSON.stringify({FirstName:fName, LastName: lName, Password:pass})})
  .then((response) => response.json())
  .then((responseData) => {
    console.log("New User Created with ID: " + responseData.CustomerID);
    this.storeCustomerID(responseData.CustomerID);
    this.setState({
      customerId: responseData.CustomerID.toString(),
    })
    console.log("CreateCustomer customerId: " + this.state.customerId);
  })
  .done();
},

});

module.exports = UserProfile;
