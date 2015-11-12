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

var bluetoothBeaconManager = require('./bluetoothBeaconManager.js');
var bluetoothScanningManager = require('./bluetoothScanningManager.js');
var cacheManager = require('./cacheManager.js');
var serverManager = require('./serverManager.js');

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
