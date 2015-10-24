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

//Stuff for SQLite
var SQLite = require('react-native-sqlite');

//Stuff for Bluetooth listening
var Beacons = require('react-native-ibeacon');
Beacons.requestAlwaysAuthorization();
Beacons.startMonitoringForRegion();
Beacons.startUpdatingLocation();
var subscription;
var stopSubscription;
var rangingSubscription;
var custID = 0;

//Stuff for Bluetooth broadcasting
var BluetoothBeacon = require('react-native').NativeModules.BluetoothBeacon;
var storeID = 6666;



var Locl = React.createClass({
	getInitialState : function() {
	return {
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
			<TouchableHighlight underlayColor="#AA9999" onPress={this.testDBSetup}>
			<View style={[styles.buttonBox, styles.setButtonBox]}>
			<Text style={styles.buttonText}>
			DB
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
    					if (this.checkStoreCache(data.beacons[i].minor)) {
    						var storeID = data.beacons[i].minor
    						console.log(storeID);
    						var saleID = this.checkAPI(custID, storeID);
    						if (saleID > 0) {
    							this.showSale(saleID);
    						}
					}
				}});
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
		rangingSubscription = null;
		subscription = null;
		Beacons.stopRangingBeaconsInRegion();
		console.log("No longer scanning");
	},

	testDBSetup : function() {
		SQLite.open("./Cache.sqlite", function (error, database) {
		if (error) {
			console.log("Failed to open database:", error);
		return;
		}

		//Setup the table
		var sql = "CREATE TABLE `STORE` (`StoreID`	INTEGER, `Visited?`	INTEGER, `Significant?`	INTEGER, `LastVisited`	INTEGER, PRIMARY KEY(StoreID)d)"; var params = ["somestring", 99];
		database.executeSQL(sql, params, callback, completeCallback);
		
		function callback(data) {
			console.log("Callback data: ", data);
		}

		function completeCallback(error) {
		if (error) {
			console.log("Failed to setup table: ", error);
			return
		}

		console.log("Table setup!");

		//Some dummy entries for the table
		var sql = "CREATE TABLE `STORE` (`StoreID`	INTEGER, `Visited?`	INTEGER, `Significant?`	INTEGER, `LastVisited`	INTEGER, PRIMARY KEY(StoreID)d)"; var params = ["somestring", 99];
		database.executeSQL(sql, params, callback, completeCallback);
		
		function callback(data) {
			console.log("Callback data: ", data);
		}

		function completeCallback(error) {
		if (error) {
			console.log("Failed to add entry: ", error);
			return
		}

		console.log("Entry 1 Added!");






		database.close(function (error) {
		if (error) {
			console.log("Failed to close database:", error);
		return
		}
		});
		}
		});
	},

	//PURPOSE: to check the cache to see if the store is new. If it is old, check the cache to see if the user visited the sale or not, 
	// if they didn't visit the sale, return false, otherwise true. 
	//REQUIRES: storeID is Integer
	//MODIFIES: new cache entry if store is new, mark as insignificant if store sale is not visited
	//EFFECTS: true if store is new, false if store has been checked AND not signficant
	checkStoreCache : function(storeID) {
		var results = [];
		SQLite.open("./Cache.sqlite", function (error, database) {
		if (error) {
			console.log("Failed to open database:", error);
		return;
		}

		var sql = "SELECT * FROM Store WHERE StoreID = '" + storeID + 	"'";
		var params = ["somestring", 99];
		database.executeSQL(sql, params, callback, errorCallback);
		
		function callback(data) {
			results.push(data);
			console.log("Got row data:", data);
		}

		function errorCallback(error) {
		if (error) {
			console.log("Failed to execute query:", error);
			return
		}

		console.log("Query complete!");

		database.close(function (error) {
		if (error) {
			console.log("Failed to close database:", error);
		return
		}
		});
		}
		});
		return true;
	},

	//PURPOSE: to check the API to see if a new/signficant store has any sales that correllated with the custID
	//REQUIRES: valid custID (!= 0) AND is INTEGER
	//MODIFIES: nothing
	//EFFECTS: returns a 0 if the store doesn't have any matching sales, otherwise it returns the saleID
	checkAPI : function(custID, storeID) {
		return 1;
	},

	//PURPOSE: to display an alert for the sale if there is a match
	//REQUIRES: valid saleID (!= 0), AND is INTEGER
	//MODIFIES: nothing
	//EFFECTS: displays an alert with the sale information 
	showSale : function(saleID) {
		console.log("A sale!");
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