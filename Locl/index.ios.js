'use strict';
var React = require('react-native');
var reactNativeStore = require('react-native-store');

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
  	NativeAppEventEmitter, 
  	AsyncStorage,
} = React;


//Stuff for Bluetooth listening
var Beacons = require('react-native-ibeacon');
Beacons.requestAlwaysAuthorization();
Beacons.startMonitoringForRegion();
Beacons.startUpdatingLocation();
var subscription;
var stopSubscription;
var rangingSubscription;

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
			<TouchableHighlight underlayColor="#AA9999" onPress={this.DBDemo}>
			<View style={[styles.buttonBox, styles.setButtonBox]}>
			<Text style={styles.buttonText}>
			DB
			</Text>
			</View>
			</TouchableHighlight>
			</View>
			<Text onPress={this.get_users}> Get </Text>
			<Text onPress={this.add_users}> Add </Text>
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
					console.log (data.beacons);
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

	onStopScanningPress : function() {
		subscription = null;
		console.log("No longer scanning");
	},

	async get_users() {
		// Add Model
		var userModel = await reactNativeStore.model("user");

		// Add Data
		var add_data = await userModel.add({
		username: "tom",
		age: 12,
		sex: "man"
		});
		// return object or null
		console.log(add_data);

		// Add Data
		var add_data = await userModel.add({
		username: "Brady",
		age: 9,
		sex: "woman"
		});
		// return object or null
		console.log(add_data);

		// Update Data
		var update_data = await userModel.update({
		username: "mary",
		age: 12
		},{
		_id: 1
		});

		console.log(update_data);

		//Remove Data
		var remove_data = await userModel.remove({
		_id: 1
		});
		console.log(remove_data);

		// search
		var find_data = await userModel.find();
		console.log("find",find_data);


    // try {
    //   var value = await AsyncStorage.getItem("10223");
    //   if (value !== null){
    //     console.log(value);
    //   } else {
    //     console.log('Initialized with no selection on disk.');
    //   }
    // } catch (error) {
    //     console.log('AsyncStorage error: ' + error.message);
    // }
 	},

    add_users: function(){
    	AsyncStorage.setItem("10223", "true");
    },



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

AppRegistry.registerComponent('Locl', () => Locl);