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
	AppStateIOS
} = React;

//Import Bluetooth listening
var Beacons = require('react-native-ibeacon');
var subscription;
var stopSubscription;
var rangingSubscription;

//Import Bluetooth state
require('react-native-bluetooth-state');

var bluetoothScanningManager = {

requestAlwaysAuthorization: function() {
	Beacons.requestAlwaysAuthorization();
},

getAuthorizationStatus: function() {
	Beacons.getAuthorizationStatus(function(authorization) {
	console.log("Bluetooth authorization: " + authorization);
});
},

startMonitoringForRegion: function() {
	Beacons.startMonitoringForRegion();
	console.log("Started monitoring");
},

startUpdatingLocation: function() {
	Beacons.startUpdatingLocation();
	console.log("Started updating location");
},

startRangingBeaconsInRegion: function() {
	Beacons.startRangingBeaconsInRegion();
	console.log("Ranging Started");
},

stopRangingBeaconsInRegion: function() {
	Beacons.stopRangingBeaconsInRegion();
	console.log("Ranging Stopped");
},

//Subscriptions
setupStatusSubscription: function() {
	var subscription = DeviceEventEmitter.addListener('centralManagerDidUpdateState', bluetoothState => {
	console.log("Bluetooth status: " + bluetoothState);
})
},

setupRestartSubscription: function() {
	var restartSubscription = DeviceEventEmitter.addListener(
		'regionDidEnter',
		(data) => {
			if (data !=null) {
					if (AppStateIOS.currentState == "active"); {
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