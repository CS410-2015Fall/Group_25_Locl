'use strict';
var React = require('react-native');

var {
	AppRegistry,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	AlertIOS, 
	ListView,
	DeviceEventEmitter, 
	AsyncStorage,
} = React;

//Stuff for Bluetooth listening
var Beacons = require('react-native-ibeacon');
var subscription;
var stopSubscription;
var rangingSubscription;

//Stuff to get Bluetooth state
require('react-native-bluetooth-state');
// Listen for bluetooth change
var subscription = DeviceEventEmitter.addListener('centralManagerDidUpdateState', bluetoothState => {
  AlertIOS.alert("Bluetooth status: " + bluetoothState);
  console.log("Bluetooth status: " + bluetoothState);
});
Beacons.getAuthorizationStatus(function(authorization) {
	AlertIOS.alert("Bluetooth authorization: " + authorization);
	console.log("Bluetooth authorization: " + authorization);
});

//Stuff for Bluetooth broadcasting
var BluetoothBeacon = require('react-native').NativeModules.BluetoothBeacon;
let storeID = 44;

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

var Locl = React.createClass({
	test : function() {
		this.processMinor(878).done();
	}, 

	getInitialState : function() {
		return {
				custID: '0',
				storeID: '0'
		}
	},

	componentDidMount: function() {
		this.auth();
		this.removeItem('101');
		Beacons.requestWhenInUseAuthorization();
		Beacons.startMonitoringForRegion();
		Beacons.startUpdatingLocation();
	},

	render: function() {
		return (
			<View style={styles.container}>
			<Text style={styles.description}>
			Locl Demo App
			</Text>
			<View style={styles.flowRight}>
			<TextInput style={styles.searchInput} value={this.state.custID} placeholder='Customer ID' onChange={this.onCustomerIDTextChanged}/> 
			</View>

			<View style={styles.flowRight}>
			<TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onStartScanningPress}> 
				<Text style={styles.buttonText}>Start Scanning</Text>
			</TouchableHighlight>

			<TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onStopScanningPress}> 
				<Text style={styles.buttonText}>Stop Scanning</Text>
			</TouchableHighlight>
			</View>

			<View style={styles.flowRight}>
			<TextInput style={styles.searchInput} value={this.state.storeID} placeholder='Store ID' onChange={this.onStoreIDTextChanged}/> 
			
			<TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onBeaconingSetPress}> 
				<Text style={styles.buttonText}>Set</Text>
			</TouchableHighlight>
			</View>

			<View style={styles.flowRight}>
			<TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onBeaconingStartPress}> 
				<Text style={styles.buttonText}>Start Broadcasting</Text>
			</TouchableHighlight>

			<TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onBeaconingStopPress}> 
				<Text style={styles.buttonText}>Stop Broadcasting</Text>
			</TouchableHighlight>
			</View>

			</View>
			)},

	onCustomerIDTextChanged(event) {
  		console.log('onCustomerIDTextChanged');
  		this.setState({ custID: event.nativeEvent.text });
  		console.log(this.state.custID);
	},

	onStoreIDTextChanged(event) {
  		console.log('onStoreIDTextChanged');
  		this.setState({ storeID: event.nativeEvent.text });
  		console.log(this.state.storeID);
	},

	onBeaconingStartPress : function() {
		BluetoothBeacon.initLocalBeacon();
		AlertIOS.alert('Warning','Beaconing Bluetooth will drain your battery. Make sure your phone is plugged in to a charger.',);
	}, 

	onBeaconingStopPress : function() {
		BluetoothBeacon.stopLocalBeacon();
		AlertIOS.alert('Alert','Bluetooth is no longer Beaconing',);
	}, 

	onBeaconingSetPress : function() {
		var currentStoreID = Number(this.state.storeID);
		if (currentStoreID <= 0 || currentStoreID >= 9999) {
			console.error("Invalid Store ID");
		}
		BluetoothBeacon.setMinor(
			currentStoreID,
			(results) => {
				AlertIOS.alert('Minor set to: ' + this.state.storeID);
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

		AlertIOS.alert('Scanning');
		console.log("Scanning");

		subscription = DeviceEventEmitter.addListener(
			'regionDidEnter',
			(data) => {
				if (data !=null) {
					console.log("Region enterred: " + data.region)}
					AlertIOS.alert("Region enterred: " + data.region);
					Beacons.startRangingBeaconsInRegion();
					rangingSubscription = DeviceEventEmitter.addListener(
						'beaconsDidRange',
						(data) => { 
							for (var i = 0; i < data.beacons.length; i++) { 
								console.log("Found minor: " + data.beacons[i].minor);
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
					AlertIOS.alert("Region exitted: " + data.region);
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
		Beacons.stopRangingBeaconsInRegion();
		rangingSubscription = null;
		console.log("No longer scanning");
		AlertIOS.alert('No longer scanning');
	},

	//PURPOSE: to create a new entry for a storeID. 
	//REQUIRES: valid storeID (!= 0) AND is INTEGER
	//MODIFIES: nothing
	//EFFECTS: return otherwise error
	//TODO:
	//	- Need to have a larger JSON for Stores, so we can differentiate incase other caching is needed 
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
		//Convert minior incase Int
		var currentMinor = String(minor);

		console.log("Processing minor: " + currentMinor);

		//Get time
		var currentCheckTime = Math.floor(Date.now() / 1000);
		console.log("Current Check Time: " + currentCheckTime);
		
		try {
			var value = await AsyncStorage.getItem(currentMinor);
			if (value !== null) {
				var contents = JSON.parse(value);
				console.log('Recovered selection from disk -> Meaningful: ' + contents.meaningful + ' Visited: ' + contents.visited + ' Favourited: ' + contents.favourited + ' Last Visited: ' + contents.lastVisited);

				var storeTime = parseInt(contents.lastVisited, 10);	
				var storeTime = storeTime + 86400;        

				if (contents.meaningful == true) {
					console.log('Meaningful so check API!');
					this.checkAPI(currentMinor);
				} else if (contents.visited == true) {
					console.log('Visited so check API!');
					this.checkAPI(currentMinor);
				} else if (contents.favourited == true) {
					console.log('Favourited so check API!');
					this.checkAPI(currentMinor);
				} else if (storeTime < currentCheckTime) {
					console.log(storeTime + " < " + currentCheckTime + "?");
					console.log('Old so update time then check API!');
					this.checkAPI(currentMinor);
				}  else 
				console.log('Known but no API check needed.');
			} else {

				console.log('No selection on disk. Adding and then check API');
				this.addItem(currentMinor, false, false, false, currentCheckTime).done()
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
			console.log("Authorization key -> " + responseData.session_id);
			AlertIOS.alert("Authorization key: " + responseData.session_id);
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
		var currentCustomerID = this.state.custID.toString();
		console.log('Checking API w/ CustID: ' + currentCustomerID + ' and StoreID: ' + storeID);

		fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/system/script/add?app_name=loclSQL&is_user_script=true&CustID="+ currentCustomerID +"&StoreID="+ storeID, {method: "POST"})
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
		AlertIOS.alert("A match sale with sale ID: " + saleID);
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

	async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      this._appendMessage('Selection removed from disk.');
    } catch (error) {
      this._appendMessage('AsyncStorage error when removing from cache: ' + error.message);
    }
  	},

});

var styles = StyleSheet.create({
	//Stuff I just added for the demo app
	description: {
		marginBottom: 20,
		fontSize: 18,
		textAlign: 'center',
		color: '#656565'
	},
	container: {
		flex: 1,
		padding: 30,
		alignItems: 'center'
	},
	text: {
		color: 'black',
		backgroundColor: 'white',
		fontSize: 30,
		margin: 80
	},
	flowRight: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'stretch',
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center',
		marginRight: 5
	},
	searchInput: {
		height: 36,
		padding: 4,
		marginRight: 5,
		flex: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		marginBottom: 10,
		color: '#48BBEC'
	}
});

AppRegistry.registerComponent('Locl', () => Locl);
