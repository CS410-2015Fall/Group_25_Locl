'use strict';

var React = require('react-native');
var StoreHome = require('./StoreHome');
var CustomerHome = require('./CustomerHome');
var Tutorial = require('./Tutorial');
var bluetoothBeaconManager = require('./bluetoothBeaconManager');
var FacebookLogin = require('./facebooklogin');

var {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicatorIOS,
	Image,
	Component,
	NavigatorIOS,
	AppRegistry,
	AsyncStorage
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

var Locl = React.createClass({
	getInitialState() {
		return {
			loading: false,
			hasCustomerID: false, 
			tutorialCompleted: false,
			storeID: '',
			customerID: '',
		}
	},

	componentDidMount() {
		this.loadTutorialStatus().done();
		this.loadStoreID().done();
		this.loadCustomerID().done();
	},

	async loadTutorialStatus() {
		try {
			var tutorialCompleted = await AsyncStorage.getItem('tutorialCompleted');
			if (tutorialCompleted !== null){
				this.setState({
					tutorialCompleted: true,
				});
				console.log("Tutorial completed");
			} else {
				console.log("Tutorial not completed");
			}
		} catch (error) {
			console.log("Async error: " + error.message);
		}
	},

	async loadStoreID() {
		try {
			var storeID = await AsyncStorage.getItem('StoreID');
			if (storeID !== null){
				this.setState({
					storeID: storeID,
				});
				bluetoothBeaconManager.onBeaconingSetPress(storeID);
				console.log("StoreID set to " + storeID);
			} else {
				console.log("Store not setup");
				this.setState({
				})
			}
		} catch (error) {
			console.log("Async error: " + error.message);
		}
	},

	async loadCustomerID() {
		console.log("Loading customerID");
		try {
			var customerID = await AsyncStorage.getItem('CustomerID');
			if (customerID !== null){
				this.setState({
					customerID: customerID,
					hasCustomerID: true, 
					loading: true,
				});
				console.log("CustomerID is: " + customerID);
			} else {
				console.log("No CustomerID found");
				this.setState({
					loading: true,
				})
			}
		} catch (error) {
			console.log("Async error: " + error.message);
		}
	},

	renderLoadingView: function() {
		return (
			<View style={styles.container}>
			<Text>
			Loading a Locl Experience..
			</Text>
			</View>
			);
	},

	render() {
		if (this.state.loading === false) {
			return (
				this.renderLoadingView()
				);
		} else {
			if(this.state.tutorialCompleted === false) {
				return (
					<NavigatorIOS ref='nav'
					style={styles.container}
					navigationBarHidden={true}
					initialRoute={{
						component: Tutorial,
					}}/>
					);
			} else if (this.state.hasCustomerID === false) {
				return (
					<NavigatorIOS ref='nav'
					style={styles.container}
					navigationBarHidden={true}
					initialRoute={{
						component: FacebookLogin,
					}}/>
					);	
			} else {
				return (
					<NavigatorIOS ref='nav'
					style={styles.container}
					navigationBarHidden={false}
					initialRoute={{
						title: "Locl",
						component: CustomerHome,
						passProps: {CustomerID: this.state.customerID, StoreID: this.state.storeID}
						
					}}/>
					);
			}

		}
	},
});

AppRegistry.registerComponent('Locl', () => Locl);
