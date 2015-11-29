'use strict';

var React = require('react-native');
var Preference = require('./Preference');

var ServerManager = require('./serverManager');

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
                               fontSize: 24,
                               marginLeft: 60,
                               marginTop: 140,
                               },
                               icon:{
                               width: 130,
                               height: 130,
                               marginTop: 20,
                               marginLeft: 90,
                               borderWidth: 4,
                               borderColor: OUTLINE,
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
                               marginTop: 18,
                               fontSize: 18,
                               color: TEXT,
                               alignSelf: 'center'
                               },
                               button: {
                               width: 130,
                               height: 60,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 4,
                               borderRadius: 8,
                               marginTop: 30,
                               marginBottom: 50,
                               marginLeft: 90
                               },
                               text:{
                               
                               }
                               });

// email not fetching, taking out for now
//<Text style={styles.description}>
//{this.props.email}
//</Text>

var UserProfile = React.createClass({
  render(){
    return (
        <View style={styles.container}>
        <Text style={styles.description}>
        {this.props.name}
        </Text>
        <Image style={styles.icon}
        source={{uri: this.props.picture}}
        />
        <TouchableHighlight style={styles.button} onPress={this.toPreference}>
        <Text style={styles.buttonText}>Proceed</Text>
        </TouchableHighlight>
        </View>
        );
  },

  toPreference(){
    this.createCustomer(this.props.first_name, this.props.last_name, this.props.id);
    this.props.navigator.push({
      title: 'Preference',
      component: Preference
    });
  },

  createCustomer(fName,lName,pass) {
    fetch(customerTableURL, {method: "POST", body: JSON.stringify({FirstName:fName, LastName: lName, Password:pass})})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Search user Query -> " + responseData.CustomerID)
      })
    .done();
  },
});

module.exports = UserProfile;
