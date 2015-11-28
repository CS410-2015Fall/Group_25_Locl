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

var styles = StyleSheet.create({
  description: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    overflow: 'visible',
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
  },
  profilePicture: {
    height: 70,
    width: 70
  }
});

var UserProfile = React.createClass({
  render(){
    return (
        <View style={styles.container}>
        <Text style={styles.description}>
        {this.props.name}
        </Text>
        <Text style={styles.description}>
        {this.props.email}
        </Text>
        <Image style={styles.profilePicture}
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
