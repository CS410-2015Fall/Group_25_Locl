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

var cacheManager = require('./cacheManager.js');

//Import Bluetooth listening
var Beacons = require('react-native-ibeacon');
var subscription;
var stopSubscription;
var rangingSubscription;

//Import Bluetooth state
require('react-native-bluetooth-state');

//Get auth
Beacons.requestWhenInUseAuthorization();

//Start monitoring
Beacons.startMonitoringForRegion();
Beacons.startUpdatingLocation();

//Setup listener for change in Bluetooth state
var subscription = DeviceEventEmitter.addListener('centralManagerDidUpdateState', bluetoothState => {
	AlertIOS.alert("Bluetooth status: " + bluetoothState);
	console.log("Bluetooth status: " + bluetoothState);
});

//Setup listener for change in Bluetooth authorization
Beacons.getAuthorizationStatus(function(authorization) {
	AlertIOS.alert("Bluetooth authorization: " + authorization);
	console.log("Bluetooth authorization: " + authorization);
});

var bluetoothScanningManager = {

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
				var region = {
					identifier: 'Locl',
					uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'    
				};
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
				var region = {
					identifier: 'Locl',
					uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'    
				};
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

};
module.exports = bluetoothScanningManager;