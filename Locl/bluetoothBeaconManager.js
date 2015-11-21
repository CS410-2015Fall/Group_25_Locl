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

var bluetoothBeaconManager = {

	onBeaconingStartPress : function() {
		BluetoothBeacon.initLocalBeacon();
		console.log("Beaconing");
	}, 

	onBeaconingStopPress : function() {
		BluetoothBeacon.stopLocalBeacon();
		console.log('Bluetooth is no longer Beaconing');
	}, 

	onBeaconingSetPress : function(storeID) {
		var setStoreID = Number(storeID);
		if (setStoreID <= 0 || setStoreID >= 9999) {
			console.error("Invalid Store ID");
		}
		BluetoothBeacon.setMinor(
			setStoreID,
			(results) => {
				console.log('Minor Setting Success: ', results.successMsg);
			}
			);
	},

};

module.exports = bluetoothBeaconManager;
