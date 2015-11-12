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

//app Name for DreamFactory
var loclSQL="?app_name=loclSQL";

//Basic Connection HTMLstrig for Database
var httpString="http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/";   

//String to connect to Items Table
var itemTableURL=httpString+"item"+loclSQL;   

//String to connect to Customer Table
var customerTableURL=httpString+"customer"+loclSQL; 

//Sting to connect to Store Table
var storeTableURL=httpString+"store"+loclSQL;

//String to connect to CustomerItem Table
var customerItemURL=httpString+"customer-items"+loclSQL;

//Search by name variable
var searchByStart="&filter=";  
var searchByMid="%20%3D%20%22";   
var searchByEnd="%22"; 
var authKey;

var serverManager = React.createClass({

	render: function() {
		return;
	},

	componentDidMount: function() {
		this.auth();
	},

	//PURPOSE: to get auth from the api when the application runs so we can make queries
	//REQUIRES: has to run on inititial render
	//MODIFIES: nothing
	//EFFECTS: returns a console print of the authorization code
	auth: function() {
		fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/user/session?app_name=loclSQL", {method: "POST", body: JSON.stringify({"email":"locl@user.com","password":"rootadmin"})})
		.then((response) => response.json())
		.then((responseData) => {
			console.log("Authorization key -> " + responseData.session_id);
			AlertIOS.alert("Authorization key: " + responseData.session_id);
			authKey = responseData.session_id;
		}) 
		.done()
	},

	//PURPOSE: to check the API to see if a new/signficant store has any sales that correllated with the custID
	//REQUIRES: valid custID (!= 0) AND is INTEGER
	//MODIFIES: nothing
	//EFFECTS: returns a 0 if the store doesn't have any matching sales, otherwise it returns the saleID
	//TODO: 
	//	- Need to update database with the saleID
	//	- Need to update this so the check doesn't occur unless there is a session key
	checkAPI : function(storeID) {
		var currentCustomerID = this.state.custID.toString();
		console.log('Checking API w/ CustID: ' + currentCustomerID + ' and StoreID: ' + storeID);

		fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/system/script/add?app_name=loclSQL&is_user_script=true&CustID="+ currentCustomerID +"&StoreID="+ storeID, {method: "POST"})
		.then((response) => response.json())
		.then((responseData) => {
			console.log("ResponseDate -> " + responseData.script_result);
			if (responseData.script_result > 0) {
				console.log("Showing sale with saleID: " + responseData.script_result);
				this.showSale(responseData.script_result); 
			}
			console.log("No match");
		})
		.done();
	},


});

module.exports = serverManager;
