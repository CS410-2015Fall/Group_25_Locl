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
		console.log("Beaconing");
	}, 

	onBeaconingStopPress : function() {
		BluetoothBeacon.stopLocalBeacon();
		console.log('Bluetooth is no longer Beaconing');
	}, 

	onBeaconingSetPress : function() {
		var currentStoreID = Number(this.state.storeID);
		if (currentStoreID <= 0 || currentStoreID >= 9999) {
			console.error("Invalid Store ID");
		}
		BluetoothBeacon.setMinor(
			currentStoreID,
			(results) => {
				console.log('Success', results.successMsg);
			}
			);
	},

};

module.exports = bluetoothBeaconManager;
