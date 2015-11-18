'use strict';

var React = require('react-native');
var StoreAdd = require('./StoreAdd');
//var Beacon = require('./Beacon');
var bt = false;

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
  AlertIOS,
  ListView,
  DeviceEventEmitter,
  AsyncStorage
} = React;

//Stuff for Bluetooth listening
var Beacons = require('react-native-ibeacon');
Beacons.requestAlwaysAuthorization();
Beacons.startMonitoringForRegion();
Beacons.startUpdatingLocation();
var subscription;
var stopSubscription;
var rangingSubscription;
let custID = '101';

//Stuff for Bluetooth broadcasting
var BluetoothBeacon = require('react-native').NativeModules.BluetoothBeacon;
let storeID = '44';

//Stuff for API
//Mostly for formatting URL that will be used to query database
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
//Search by name variable
var searchByStart="&filter=";
var searchByMid="%20%3D%20%22";
var searchByEnd="%22";
var authKey;

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
  },

  container: {
    flex            : 1,
    alignItems      : 'center',
    backgroundColor : '#F5FCFF',
    paddingTop      : 30
  },
  instructionsText : {
    fontSize : 20
  },
  separator : {
    borderWidth  : .5,
    borderColor  : '#AEAEAE',
    height       : 1,
    width        : 300,
    marginBottom : 25
  },
  labelContainer : {
    flexDirection  : 'row',
    width          : 300
  },
  labelText : {
    paddingRight : 10,
    fontSize     : 18
  },
  textInput : {
    height      : 26,
    borderWidth : 0.5,
    borderColor : '#0f0f0f',
    padding     : 4,
    flex        : 1,
    fontSize    : 13,
  },
  buttonContainer : {
    flexDirection  : 'row',
    justifyContent : 'center',
    alignItems     : 'center',
    marginTop      : 20
  },
  touchableHighlight : {
    marginLeft  : 10,
    marginRight : 10,
  },
  buttonBox : {
    flexDirection  : 'row',
    justifyContent : 'center',
    alignItems     : 'center',
    padding        : 10,
    borderWidth    : 2,
    borderRadius   : 5
  },
  saveButtonBox : {
    borderColor : '#AA0000'
  },
  loadButtonBox : {
    borderColor : '#00AA00'
  },
  setButtonBox : {
    borderColor : '#00AA00'
  },
  buttonText : {
    fontSize : 16,
  },
  outputContainer : {
    width          : 300,
    height         : 200,
    justifyContent : 'center',
    alignItems     : 'center',
    borderWidth    : .5,
    borderColor    : "#999999",
    marginTop      : 20
  }, 
  row: {
    padding: 8,
    paddingBottom: 16
  }, 
  smallText: {
    fontSize: 11
  },
  formInput: {
    flex: 1,
    height: 26,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#555555",
  },
  saved: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

var StoreHome = React.createClass({
  render(){
    return (<View style={styles.container}>
        <Text style={styles.description}>
        Your store's items:
        </Text>
        <TouchableHighlight style={styles.button} onPress={this.toStoreAdd}>
        <Text style={styles.buttonText}>Add Items</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.toBeacon}>
        <Text style={styles.buttonText}>Bluetooth</Text>
        </TouchableHighlight>
        <TouchableHighlight
        style={styles.touchableHighlight}
        underlayColor="#99AA99"
        onPress={this.onStopPress}>
        <View style={[styles.buttonBox, styles.loadButtonBox]}>
        <Text style={styles.buttonText}>
        Stop
        </Text>
        </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="#AA9999" onPress={this.onStartPress}>
        <View style={[styles.buttonBox, styles.saveButtonBox]}>
        <Text style={styles.buttonText}>
        Start
        </Text>
        </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="#AA9999" onPress={this.onSetPress}>
        <View style={[styles.buttonBox, styles.setButtonBox]}>
        <Text style={styles.buttonText}>
        Set
        </Text>
        </View>
        </TouchableHighlight>

        </View>);
  },

  toStoreAdd(){
    this.props.navigator.push({
      title: 'StoreAdd',
      component: StoreAdd
    });

  },
  toBeacon(){
    this.props.navigator.push({
      title: 'Beacon',
      component: Beacon
    });

  },

});

module.exports = StoreHome;
