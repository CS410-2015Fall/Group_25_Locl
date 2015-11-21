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
Beacons.requestAlwaysAuthorization();

//Start monitoring
Beacons.startMonitoringForRegion();
Beacons.startUpdatingLocation();

//For debugging the current bluetooth state
var subscription = DeviceEventEmitter.addListener('centralManagerDidUpdateState', bluetoothState => {
	console.log("Bluetooth status: " + bluetoothState);
});
Beacons.getAuthorizationStatus(function(authorization) {
	console.log("Bluetooth authorization: " + authorization);
});

var bluetoothScanningManager = {

startRangingBeaconsInRegion: function() {
	Beacons.startRangingBeaconsInRegion();
	console.log("Ranging Started");
},

stopRangingBeaconsInRegion: function() {
	Beacons.stopRangingBeaconsInRegion();
	console.log("Ranging Stopped");
},

setupRestartSubscription: function() {
	var restartSubscription = DeviceEventEmitter.addListener(
		'regionDidEnter',
		(data) => {
			if (data !=null) {
					console.log("Region re-entered");
					if (this.currentAppState == "active") {
    					bluetoothScanningManager.startRangingBeaconsInRegion();
  					}
			}
		}
		);
},

setupStopSubscription: function(){
	var stopSubscription = DeviceEventEmitter.addListener(
		'regionDidExit',
		(data) => {
			if (data !=null) {
				console.log("Region exitted");
				Beacons.stopRangingBeaconsInRegion();
			}
		}
		);
},




};
module.exports = bluetoothScanningManager;