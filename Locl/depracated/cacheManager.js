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

var cacheManager = {

//PURPOSE: to create a new entry for a storeID. 
//REQUIRES: valid storeID (!= 0) AND is INTEGER
//MODIFIES: nothing
//EFFECTS: return otherwise error
//TODO:
//	- Need to have a larger JSON for Stores, so we can differentiate incase other caching is needed 
async addItem(storeID, visited, favourited, meaningful, lastVisited) {
	console.log("Adding Store: " + storeID);
	
	//Convert arguments to Strings
	var currentStoreID = storeID.toString();
	var currentVisited = visited.toString();
	var currentFavourited = favourited.toString();
	var currentMeaningful = meaningful.toString();
	var currentLastVisited = lastVisited.toString();

	//Get Store time
	var currentStoreTime = String(Math.floor(Date.now() / 1000));
	console.log("Current Store Time: " + currentStoreTime);

	//Add to Cache
	try {
		let defaultSet = '{"visited": ' + currentVisited + ', "favourited": ' + currentFavourited +', "meaningful": ' + currentMeaningful + ', "lastVisited": ' + currentStoreTime + ', "lastSale": 0 }';
		await AsyncStorage.setItem(currentStoreID, defaultSet);
		console.log('Saved selection to disk. Meaningful: ' + currentMeaningful + ' Visited: ' + currentVisited + ' Favourited: ' + currentFavourited + ' Last Visited: ' + currentStoreTime);
	} catch (error) {
		console.log('AsyncStorage error when adding item: ' + error.message);
	}
},

//PURPOSE: Show notification if store exists and is meaningful, Check API if store exists AND is favourited OR visited, Check API if lastVisited is old. 
//REQUIRES: storeID is Integer
//MODIFIES: new cache entry if store is new, mark as insignificant if store sale is not visited
//EFFECTS: none
async processMinor(minor) {
	//Convert minior incase Int
	var currentMinor = String(minor);

	console.log("Processing minor: " + currentMinor);

	//Get time
	var currentCheckTime = Math.floor(Date.now() / 1000);
	console.log("Current Check Time: " + currentCheckTime);
	
	try {
		var value = await AsyncStorage.getItem(currentMinor);
		if (value !== null) {
			var contents = JSON.parse(value);
			console.log('Recovered selection from disk -> Meaningful: ' + contents.meaningful + ' Visited: ' + contents.visited + ' Favourited: ' + contents.favourited + ' Last Visited: ' + contents.lastVisited);

			var storeTime = parseInt(contents.lastVisited, 10);	
			var storeTime = storeTime + 86400;        

			if (contents.meaningful == true) {
				console.log('Meaningful so check API!');
				this.checkAPI(currentMinor);
			} else if (contents.visited == true) {
				console.log('Visited so check API!');
				this.checkAPI(currentMinor);
			} else if (contents.favourited == true) {
				console.log('Favourited so check API!');
				this.checkAPI(currentMinor);
			} else if (storeTime < currentCheckTime) {
				console.log(storeTime + " < " + currentCheckTime + "?");
				console.log('Old so update time then check API!');
				this.checkAPI(currentMinor);
			}  else 
			console.log('Known but no API check needed.');
		} else {

			console.log('No selection on disk. Adding and then check API');
			this.addItem(currentMinor, false, false, false, currentCheckTime).done()
			this.checkAPI(currentMinor);

		}
	} catch (error) {
		console.log('AsyncStorage error when getting item: ' + error.message);
	}
},

async removeItem(key) {
	try {
		await AsyncStorage.removeItem(key);
		this._appendMessage('Selection removed from disk.');
	} catch (error) {
		this._appendMessage('AsyncStorage error when removing from cache: ' + error.message);
	}
},

//PURPOSE: associate a saleID to a store to that way a saleID can be checked instead of a store incase a user re-enters a fence
//REQUIRES: valid storeID AND saleID
//MODIFIES: store
//EFFECTS: associate a saleID to a store
async updateSale(saleID, storeID) {

}, 

//PURPOSE: set a store to favourited
//REQUIRES: valid storeID
//MODIFIES: store
//EFFECTS: sets store favourite to true or false depending on boolean
async setFavourite(boolean, storeID) {

},

};

module.exports = cacheManager;
