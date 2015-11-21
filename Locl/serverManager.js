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

var serverManager = {

//PURPOSE: to get auth from the api when the application runs so we can make queries
//REQUIRES: has to run on inititial render
//MODIFIES: nothing
//EFFECTS: returns a console print of the authorization code
auth: function() {
	fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/user/session?app_name=loclSQL", {method: "POST", body: JSON.stringify({"email":"locl@user.com","password":"rootadmin"})})
	.then((response) => response.json())
	.then((responseData) => {
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

//Inputs: fName= First Name(String)    lName= Last Name(String)    pass= Password(String)    
//Output:none
//note: Null items are allowed. if user doesnot enter just leave fields blank and the database will store as iTem=null.
createCustomer: function(fName,lName,pass) {
    fetch(customerTableURL, {method: "POST", body: JSON.stringify({FirstName:fName, LastName: lName, Password:pass})})
    .then((response) => response.json())
    .then((responseData) => {
        console.log("Search user Query -> " + responseData.CustomerID)
    })
    .done();
},

//Input: sName= Store Name(String)    sAddress= Store Address(String)    transmitting= True or False(Boolean)
//        StoreHTMLimg= URL link with Store image(string)
//output:none
//note: sName must be unique and cannot be same as others. trans must be true or false cannot be null.
createStore: function(sName,sAddress,transmitting,sImage) {
    fetch(storeTableURL, {method: "POST", body: JSON.stringify({StoreName: sName, Address: sAddress, Transmitting: transmitting, StoreHTMLimg: sImage})})
    .then((response) => response.json())
    .then((responseData) => {
        console.log("Search user Query -> " + responseData.StoreID)
    })
    .done();
},

//Input: itemName= Name of preference Item(Integer)       customerID= Existing CustomerID(Integer)
//output:none
//note: customerID is a foreign key and must reference existing Customer in Database
createCustomerItem: function(custID, itemName) {
    fetch(customerItemURL, {method: "POST", body: JSON.stringify({CustID: custID, ItemName: itemName})})
    .then((response) => response.json())
    .then((responseData) => {
        console.log("DONE");
    })
    .done();
}, 

//Input: name= Store Name(String)  desc= Store Description(String)  sDate= Start Date(String)   eDate= End Date(String)  
//        qty= Quantity(Integer)   regPrice = Regular Price(Integer)   sPrice= Sale Price(Integer)    sID= StoreID(Integer) 
//        upc= UPC(Integer)   imgLink= HTTP Image Link(String)
//Output: none
//note: sID must be and existing value in store table. HTMLimg can be null or set to a specific link.       
createStoreItem: function(name,desc,sDate,eDate,qty,regPrice,salePrice,sID,upc,imgLink) {
    fetch(itemTableURL, {method: "POST", body: JSON.stringify({Name: name, Description:desc,StartDate:sDate,EndDate:eDate,Quantity:qty, RegPrice:regPrice,SalePrice: salePrice, UPC: upc, StoreID:sID,HTMLimg:imgLink})})
    .then((response) => response.json())
    .then((responseData) => {
     console.log("DONE");
 })
    .done();
},

//Search from any table with 1 filter function. 
//Input: fval= Filter Value(String)   ftype= Filter Name(String)  ftable= is one of (customerTableURL/itemTableURL/storeTableURL)
//Output: Array of Results based on search. Null if array has no results.
//Note: so if you want to search from table customer table, by first name and lets say a user by the FirstName of nasrin
//      you would simply enter searchByOneFilter("nasrin","FirstName",customerTableURL)
searchByOneFilter: function searchByOneFilter(fval, fname, ftable) {
    fetch(ftable+searchByStart+fname+searchByMid+fval+searchByEnd, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {    
        console.log("CustName:--->"+responseData.record[0].ItemName)
    })
    .done();
},        

//Input: CustID=customerID   itemName= name of the item 
//Output: None
deleteOneCustomerItem: function deleteOneCustomerItem(custID,itemName) {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer-items?app_name=loclSQL&filter=CustID%20%3D"+custID+"%20and%20itemname%20%3D%20%22"+itemName+"%22", {method: "DELETE"})
    .then((response) => response.json())
    .then((responseData) => {    
        console.log("Deleted Customer Item");
    })
    .done();
},  

//Input: storeId =storeID and itemName= name of the item
//Output: none
deleteOneStoreItem: function deleteOneStoreItem(storeID,itemName) {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL&filter=StoreID%20%3D"+storeID+"%20and%20Name%20%3D%20%22"+itemName+"%22", {method: "DELETE"})
    .then((response) => response.json())
    .then((responseData) => {    
        console.log("Deleted Store Item");
    })
    .done();
},

//Adds and Array of prefence item into the customer preference list
//Input: custID= Customer ID   Array = String of preference items
//Output: none
bulkAddPreferenceItem: function bulkAddPreferenceItem(custID, array) {
    var i;
    for(i=0;i<array.length;i++){
        this.createCustomerItem(custID, array[i]);
    }
}, 

//Input: cid= customer ID    itemName= name of the item   callback=asynch callback
//Output: ItemID 
searchFilter: function searchFilter(cid,itemName,callback) {
   fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer-items?app_name=loclSQL&filter=CustID%20%3D"+cid+"%20and%20itemname%20%3D%20%22"+itemName+"%22", {method: "GET"})
   .then((response) => response.json())
   .then((responseData) => {    
     callback(responseData.record[0].ItemID);
 })
   .done();
},

//Input: cID= CustomerID      iTem= PreferenceItem
//Output: none
//note: so if you want to add a new item for customer with id 4 on position item2 with a new value of "shorts". 
//      you would simply call updateCustomerItem(4,"shorts")
updateCustomerPreferenceItem: function updateCustomer(cID,currentname,newName) {
    this.searchFilter(cID, currentname, function(returnedValue){
        fetch(customerItemURL, {method: "Put", body: JSON.stringify({ItemID:returnedValue,ItemName:newName})})
        .then((response) => response.json())
        .then((responseData) => {
        })
        .done();
    });
}, 

//PURPOSE: Search from StoreTable given a storeID to get all items by that store 
//MODIFIES: Array of Results based on search. Null if array has no results.
searchStoreTable: function searchStoreTable(sid, callback) {
    fetch(storeTableURL+"&filter=StoreID="+ sid, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {    
        console.log("Response data: " + responseData.record[0]);
        callback(responseData.record[0]);
    })
    .done();
},  

//PURPOSE: Search from StoreItems Table given a storeID to get all items by that store 
//Output: Array of Results based on search. Null if array has no results.
searchStoreItems: function searchStoreItems(sid, callback) {
    fetch(itemTableURL + "&filter=StoreID=" + sid, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {    
        callback(responseData);
    })
    .done();
},

//This was for testing purposes
sum: function(value1, value2) {
  return value1 + value2;
},

};

module.exports = serverManager;
