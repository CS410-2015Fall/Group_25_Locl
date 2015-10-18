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
  	DeviceEventEmitter
} = React;

//Stuff for Bluetooth listening
var {DeviceEventEmitter} = React;
var Beacons = require('react-native-ibeacon');
Beacons.requestWhenInUseAuthorization();
var region = {
	identifier: 'Locl',
    uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0'    
};
Beacons.startRangingBeaconsInRegion(region);
var subscription;

//Stuff for Bluetooth broadcasting
var BluetoothBeacon = require('react-native').NativeModules.BluetoothBeacon;
var storeID = 6666;

var Locl = React.createClass({
	// Generate the initial state of the view.
	getInitialState : function() {
	return {
	// textInput seemed like it should have an initial state, so I moved it here. -- KD
        textInputValue : null,
        resultsText : 'Nothing has happened yet :('
        }
    },
	render: function() {
		return (
			<View style={styles.container}>

			<Text style={styles.instructionsText}>
			Locl
			</Text>

			<View style={styles.separator}/>

			<View style={styles.buttonContainer}>

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
			</View>
	      	</View>
			);
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

	onStartScanningPress : function() {
		subscription = DeviceEventEmitter.addListener(
      	'beaconsDidRange',
        
        (data) => {
        console.log(data.beacons);
        });
        console.log("Scanning");
	}, 

	onStopScanningPress : function() {
		subscription = null;
		console.log("No longer scanning");
	}
});


var styles = StyleSheet.create({
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
 	 }
});

AppRegistry.registerComponent('Locl', () => Locl);