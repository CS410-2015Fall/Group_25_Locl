'use strict';

var React = require('react-native');
var CustomerAdd = require('./CustomerAdd');
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

var CustomerList = React.createClass({
                                   render(){
                                   return (<View style={styles.container}>
                                           <Text style={styles.description}>
                                           Your list:
                                           </Text>
                                           <TouchableHighlight style={styles.button} onPress={this.toCustomerAdd}>
                                           <Text style={styles.buttonText}>Customer</Text>
                                           </TouchableHighlight>
                                            <TouchableHighlight style={styles.button} onPress={this.range}>
                                            <Text style={styles.buttonText}>Bluetooth</Text>
                                            </TouchableHighlight>
                                           <TouchableHighlight underlayColor="#AA9999" onPress={this.onStartScanningPress}>
                                           <View style={[styles.buttonBox, styles.setButtonBox]}>
                                           <Text style={styles.buttonText}>
                                           Start
                                           </Text>
                                           </View>
                                           </TouchableHighlight>
                                           
                                           <TouchableHighlight underlayColor="#AA9999" onPress={this.onStopScanningPress}>
                                           <View style={[styles.buttonBox, styles.setButtonBox]}>
                                           <Text style={styles.buttonText}>
                                           Stop
                                           </Text>
                                           </View>
                                           </TouchableHighlight>

                                           </View>);
                                   },
                                   
                                   toCustomerAdd(){
                                     this.props.navigator.push({
                                                               title: 'CustomerAdd',
                                                               component: CustomerAdd
                                     });
                                   },
                                    
                                   range(){
                                     if (!bt){
                                      console.log('bluetooth on');
                                      bt = true;
                                     } else {
                                      console.log('bluetooth off');
                                      bt = false;
                                     }
                                   },
                                     
                                     
                                     test : function() {
                                     this.processMinor(878).done();
                                     },
                                     
                                     getInitialState : function() {
                                     return {
                                     }
                                     },
                                     
                                     componentDidMount: function() {
                                     this.auth();
                                     },
                                     
                                     onStartPress : function() {
                                     BluetoothBeacon.initLocalBeacon();
                                     AlertIOS.alert('Warning','Beaconing Bluetooth will drain your battery. Make sure your phone is plugged in to a charger.',);
                                     },
                                     
                                     onStopPress : function() {
                                     BluetoothBeacon.stopLocalBeacon();
                                     AlertIOS.alert('Alert','Bluetooth is no longer Beaconing',);
                                     },
                                     
                                     onSetPress : function() {
                                     if (storeID <= 0 || storeID >= 9999) {
                                     console.error("Invalid Store ID");
                                     }
                                     BluetoothBeacon.setMinor(
                                                              storeID,
                                                              (results) => {
                                                              console.log('Success', results.successMsg);
                                                              }
                                                              );
                                     },
                                     
                                     //PURPOSE: start scanning for Beacons
                                     //REQUIRES: need permission to use Bluetooth, must not be currently scanning
                                     //MODIFIES: subscription for ranging, stop subscription
                                     //EFFECTS: starts bluetooth scanning
                                     //TODO:
                                     //	- Need to verify this works with processing minors
                                     onStartScanningPress : function() {
                                     console.log("Scanning");
                                     
                                     subscription = DeviceEventEmitter.addListener(
                                                                                   'regionDidEnter',
                                                                                   (data) => {
                                                                                   if (data !=null) {
                                                                                   console.log("Region enterred: " + data.region)}
                                                                                   Beacons.startRangingBeaconsInRegion();
                                                                                   console.log('Start range-ing');
                                                                                   rangingSubscription = DeviceEventEmitter.addListener(
                                                                                                                                        'beaconsDidRange',
                                                                                                                                        (data) => {
                                                                                                                                        for (var i = 0; i < data.beacons.length; i++) {
                                                                                                                                        console.log(data.beacons[i].minor);
                                                                                                                                        this.processMinor(data.beacons[i].minor).done();
                                                                                                                                        }
                                                                                                                                        });
                                                                                   });
                                     
                                     console.log("regionDidEnter subscription set");
                                     
                                     stopSubscription = DeviceEventEmitter.addListener(
                                                                                       'regionDidExit',
                                                                                       (data) => {
                                                                                       if (data !=null) {
                                                                                       console.log("Region exitted: " + data.region)
                                                                                       console.log('Stop Range-ing');
                                                                                       Beacons.stopRangingBeaconsInRegion();
                                                                                       rangingSubscription = null;
                                                                                       }
                                                                                       });
                                     
                                     console.log("regionDidExit subscription set");
                                     },
                                     
                                     //PURPOSE: stop scanning for Beacons
                                     //REQUIRES: nothing
                                     //MODIFIES: nothing
                                     //EFFECTS: must currently be scanning
                                     //TODO:
                                     //	- Need to verify this is actually stopping the scanning
                                     onStopScanningPress : function() {
                                     console.log("Stopping scanning");
                                     rangingSubscription = null;
                                     subscription = null;
                                     Beacons.stopRangingBeaconsInRegion();
                                     console.log("No longer scanning");
                                     },
                                     
                                     //PURPOSE: to create a new entry for a storeID.
                                     //REQUIRES: valid storeID (!= 0) AND is INTEGER
                                     //MODIFIES: nothing
                                     //EFFECTS: return otherwise error
                                     //TODO:
                                     //	- Need to have a larger JSON for Stores, so we can differentiate incase other caching is needed
                                     //TODO: this;
                                     async addItem(storeID, visited, favourited, meaningful, lastVisited) {
                                     console.log("Adding Store: " + storeID);
                                     
                                     //Convert arguments to Strings
                                     var currentStoreID = storeID.toString();
                                     var currentVisited = visited.toString();
                                     var currentFavourited = favourited.toString();
                                     var currentMeaningful = meaningful.toString();
                                     var currentLastVisited = lastVisited.toString();
                                     
                                     //Get Store time
                                     var currentStoreTime = String(Math.floor(Date.now() / 1000));
                                     console.log("Current Store Time: " + currentStoreTime);
                                     
                                     //Add to Cache
                                     try {
                                     let defaultSet = '{"visited": ' + currentVisited + ', "favourited": ' + currentFavourited +', "meaningful": ' + currentMeaningful + ', "lastVisited": ' + currentStoreTime + ', "lastSale": 0 }';
                                     await AsyncStorage.setItem(currentStoreID, defaultSet);
                                     console.log('Saved selection to disk. Meaningful: ' + currentMeaningful + ' Visited: ' + currentVisited + ' Favourited: ' + currentFavourited + ' Last Visited: ' + currentStoreTime);
                                     } catch (error) {
                                     console.log('AsyncStorage error when adding item: ' + error.message);
                                     }
                                     },
                                     
                                     //PURPOSE: Show notification if store exists and is meaningful, Check API if store exists AND is favourited OR visited, Check API if lastVisited is old. 
                                     //REQUIRES: storeID is Integer
                                     //MODIFIES: new cache entry if store is new, mark as insignificant if store sale is not visited
                                     //EFFECTS: none
                                     async processMinor(minor) {
                                     console.log("Processing minor: " + currentMinor);
                                     
                                     //Convert minior incase Int
                                     var currentMinor = String(minor);
                                     
                                     //Get time
                                     var currentCheckTime = Math.floor(Date.now() / 1000);
                                     console.log("Current Check Time: " + currentCheckTime);
                                     
                                     try {
                                     var value = await AsyncStorage.getItem(currentMinor);
                                     if (value !== null) {
                                     var contents = JSON.parse(value);
                                     console.log('Recovered selection from disk -> Meaningful: ' + contents.meaningful + ' Visited: ' + contents.visited + ' Favourited: ' + contents.favourited + ' Last Visited: ' + contents.lastVisited);
                                     
                                     var storeTime = parseInt(contents.lastVisited, 10);	        
                                     
                                     if (contents.meaningful == true) {
                                     console.log('Meaningful so check API!');
                                     this.checkAPI(currentMinor);
                                     } else if (contents.visited == true) {
                                     console.log('Visited so check API!');
                                     this.checkAPI(currentMinor);
                                     } else if (contents.favourited == true) {
                                     console.log('Favourited so check API!');
                                     this.checkAPI(currentMinor);
                                     } else if ((storeTime + 86400) < currentCheckTime) {
                                     var boundTime = storeTime + 86400;
                                     console.log(boundTime + " < " + currentCheckTime + "?");
                                     console.log('Old so update time then check API!');
                                     this.checkAPI(currentMinor);
                                     }  else 
                                     console.log('Known but no API check needed.');
                                     } else {
                                     
                                     console.log('No selection on disk. Adding and then check API');
                                     this.addItem(currentMinor, false, false, false, 0).done()
                                     this.checkAPI(currentMinor);
                                     
                                     }
                                     } catch (error) {
                                     console.log('AsyncStorage error when getting item: ' + error.message);
                                     }
                                     },
                                     
                                     //PURPOSE: to get auth from the api when the application runs so we can make queries
                                     //REQUIRES: has to run on inititial render
                                     //MODIFIES: nothing
                                     //EFFECTS: returns a console print of the authorization code
                                     auth: function() {
                                     fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/user/session?app_name=loclSQL", {method: "POST", body: JSON.stringify({"email":"locl@user.com","password":"rootadmin"})})
                                     .then((response) => response.json())
                                     .then((responseData) => {
                                           console.log("Authorization key -> " + responseData.session_id)
                                           authKey = responseData.session_id;
                                           }) 
                                     .done()
                                     },
                                     
                                     //PURPOSE: to check the API to see if a new/signficant store has any sales that correllated with the custID
                                     //REQUIRES: valid custID (!= 0) AND is INTEGER
                                     //MODIFIES: nothing
                                     //EFFECTS: returns a 0 if the store doesn't have any matching sales, otherwise it returns the saleID
                                     //TODO: 
                                     //	- Need to update database with the saleID
                                     //	- Need to update this so the check doesn't occur unless there is a session key
                                     checkAPI : function(storeID) {
                                     console.log('Checking API w/ CustID: ' + custID + ' and StoreID: ' + storeID);
                                     
                                     fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/system/script/add?app_name=loclSQL&is_user_script=true&CustID="+ custID +"&StoreID="+ storeID, {method: "POST"})
                                     .then((response) => response.json())
                                     .then((responseData) => {
                                           console.log("ResponseDate -> " + responseData.script_result);
                                           if (responseData.script_result > 0) {
                                           console.log("Showing sale with saleID: " + responseData.script_result);
                                           this.showSale(responseData.script_result); 
                                           }
                                           console.log("No match");
                                           })
                                     .done();
                                     },
                                     
                                     //PURPOSE: to display an alert for the sale if there is a match
                                     //REQUIRES: valid saleID (!= 0), AND is INTEGER
                                     //MODIFIES: nothing
                                     //EFFECTS: displays an alert with the sale information 
                                     //TODO: 
                                     //	- Need an API call to display sale data
                                     showSale : function(saleID) {
                                     console.log("A match sale with sale ID: " + saleID);
                                     },
                                     
                                     //PURPOSE: associate a saleID to a store to that way a saleID can be checked instead of a store incase a user re-enters a fence
                                     //REQUIRES: valid storeID AND saleID
                                     //MODIFIES: store
                                     //EFFECTS: associate a saleID to a store
                                     async updateSale(saleID, storeID) {
                                     
                                     }, 
                                     
                                     //PURPOSE: set a store to favourited
                                     //REQUIRES: valid storeID
                                     //MODIFIES: store
                                     //EFFECTS: sets store favourite to true or false depending on boolean
                                     async setFavourite(boolean, storeID) {
                                     
                                     },

                                   
                                   });

module.exports = CustomerList;