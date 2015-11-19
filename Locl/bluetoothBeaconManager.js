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

var BluetoothBeacon = require('react-native').NativeModules.BluetoothBeacon;
let storeID = 44;

var bluetoothBeaconManager = {

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

};

module.exports = bluetoothBeaconManager;
