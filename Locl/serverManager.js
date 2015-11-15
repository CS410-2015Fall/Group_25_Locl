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

var authKey;
    
//Sample Bulk customer Item Array------------------    
var items = ["nike","Rolex","goglessie"]; 
//Sample Bulk customer Item Array------------------   

    
//Sample Bulk storeItem Array---------------------- 
var store = [{Name: "chips", Description: "come one come all",StartDate:"11-11-11",EndDate:"11-12-12",Quantity:2, RegPrice:140,SalePrice: 100, UPC: 112233, StoreID:102,HTMLimg:"www.google.com"},{Name: "fries", Description:"hello hello all",StartDate:"11-11-11",EndDate:"11-13-13",Quantity:1, RegPrice:111,SalePrice: 120, UPC: 123123, StoreID:102,HTMLimg:"www.gagagogole.com"}];
//Sample Bulk storeItem Array----------------------         
    

//Sample Store ID Array----------------------------
var idarray = [101,102,103,104];
//Sample Store ID Array----------------------------     

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
	auth: function auth() {
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
	checkAPI : function checkAPI(storeID) {
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
        
//PURPOSE:Create Customer function. 
//REQUIRES: fName= First Name(String)    lName= Last Name(String)    pass= Password(String)    
//MODIFIES:none
//EFFECTS: Null items are allowed. if user doesnot enter just leave fields blank and the database will store as iTem=null.
        createCustomer: function createCustomer(fName,lName,pass) {
        fetch(customerTableURL, {method: "POST", body: JSON.stringify({FirstName:fName, LastName: lName, Password:pass})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("Search user Query -> " + responseData.CustomerID)
        })
        .done();
    },
        
//PURPOSE: Create Store fucntion. 
//REQUIRES: sName= Store Name(String)    sAddress= Store Address(String)    transmitting= True or False(Boolean)
//        StoreHTMLimg= URL link with Store image(string)
//MODIFIES:none
//EFFECTS: sName must be unique and cannot be same as others. trans must be true or false cannot be null.
        createStore: function createStore(sName,sAddress,transmitting,sImage) {
        fetch(storeTableURL, {method: "POST", body: JSON.stringify({StoreName: sName, Address: sAddress, Transmitting: transmitting,                StoreHTMLimg: sImage})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("Search user Query -> " + responseData.StoreID)
        })
        .done();
    },
        
//PURPOSE: Create CustomerItem function. 
//REQUIRES: itemName= Name of preference Item(Integer)       customerID= Existing CustomerID(Integer)
//MODIFIES:none
//EFFECTS: customerID is a foreign key and must reference existing Customer in Database
          createCustomerItem: function createCustomerItem(custID, itemName) {
        fetch(customerItemURL, {method: "POST", body: JSON.stringify({CustID: custID, ItemName: itemName})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("DONE");
        })
        .done();
    }, 
        
//PURPOSE:Create StoreItem function. 
//REQUIRES: name= Store Name(String)  desc= Store Description(String)  sDate= Start Date(String)   eDate= End Date(String)  
//        qty= Quantity(Integer)   regPrice = Regular Price(Integer)   sPrice= Sale Price(Integer)    sID= StoreID(Integer) 
//        upc= UPC(Integer)   imgLink= HTTP Image Link(String)
//MODIFIES:none
//EFFECTS: sID must be and existing value in store table. HTMLimg can be null or set to a specific link.       
        createStoreItem: function createStoreItem(name,desc,sDate,eDate,qty,regPrice,salePrice,sID,upc,imgLink) {
        fetch(itemTableURL, {method: "POST", body: JSON.stringify({Name: name, Description:desc,StartDate:sDate,EndDate:eDate,Quantity:qty, RegPrice:regPrice,SalePrice: salePrice, UPC: upc, StoreID:sID,HTMLimg:imgLink})})
        .then((response) => response.json())
        .then((responseData) => {
             console.log("DONE");
        })
        .done();
    },
        
//PURPOSE: Search from StoreItems Table given a storeID to get all items by that store 
//REQUIRES: 
//MODIFIES: Array of Results based on search. Null if array has no results.
        searchStoreItems: function searchStoreItems(sid,callback) {
        fetch(itemTableURL+"&filter=StoreID="+sid, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {    
            callback(responseData);
        })
        .done();
    },        

      
//PURPOSE: Delete a customer item given the name of the item and the customerID 
//REQUIRES: CustID=customerID   itemName= name of the item 
//MODIFIES: None
        deleteOneCustomerItem: function deleteOneCustomerItem(custID,itemName) {  
            var test =itemName.replace(/ /g, "%20");
            fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer-items?app_name=loclSQL&filter=CustID%3D"+custID+"%20and%20itemname%3D%20%22"+test+"%22", {method: "DELETE"})
        .then((response) => response.json())
        .then((responseData) => {    
            console.log("Deleted Customer Item");
        })
        .done();
        
    },  

//PURPOSE: Delete a store item given the name of the item and the storeID 
//REQUIRES: storeId =storeID and itemName= name of the item
//MODIFIES: None
    deleteOneStoreItem: function deleteOneStoreItem(storeID,itemName) {
         var test =itemName.replace(/ /g, "%20");
         console.log(test);
        fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL&filter=StoreID%3D"+storeID+"%20and%20Name%3D%20%22"+test+"%22", {method: "DELETE"})
        .then((response) => response.json())
        .then((responseData) => {    
            console.log("Deleted Store Item");
        })
        .done();
    },
        
//PURPOSE: Adds and Array of prefence item into the customer preference list
//REQUIRES: custID= Customer ID   Array = String of preference items
//MODIFIES: none
    bulkAddPreferenceItem: function bulkAddPreferenceItem(custID, array) {
        var i;
        for(i=0;i<array.length;i++){
            this.createCustomerItem(custID, array[i]);
        }
    },
    
//PURPOSE: Search from customerTable with async callback to obtain itemID 
//REQUIRES: cid= customer ID    itemName= name of the item   callback=asynch callback
//MODIFIES: ItemID 
        searchCustomerFilter: function searchFilter(cid,itemName,callback) {
           fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer-items?app_name=loclSQL&filter=CustID%20%3D"+cid+"%20and%20itemname%20%3D%20%22"+itemName+"%22", {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {    
             callback(responseData.record[0].ItemID);
        })
        .done();
    },
//PURPOSE: Update CustomerPreferenceItem Given CustomerID
//REQUIRES: cID= CustomerID      iTem= PreferenceItem
//MODIFIES: none
//EFFECTS: so if you want to add a new item for customer with id 4 on position item2 with a new value of "shorts". 
//      you would simply call updateCustomerItem(4,"shorts")
        updateCustomerItem: function updateCustomerItem(cID,currentname,newName) {
        this.searchCustomerFilter(cID, currentname, function(returnedValue){
        fetch(customerItemURL, {method: "Put", body: JSON.stringify({ItemID:returnedValue,ItemName:newName})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("Done!!");
        })
        .done();
           });
    },

//PURPOSRE: Adds and Array of store item into the store items list
//REQUIRES: array of json formatted stores
//MODIFIES: conformation message
    bulkAddStoreItem: function bulkAddStoreItem(array) {
        var i;
        var end = array.length;
        console.log(array[0].Name);
        for(i=0;i<end;i++){
 console.log("Adding item");           this.createStoreItem(array[i].Name,array[i].Description,array[i].StartDate,array[i].EndDate,array[i].Quantity,array[i].RegPrice,array[i].SalePrice,array[i].StoreID,array[i].upc,array[i].HTMLimg);
        }
    },
//PURPOSE: Update StoreItem Given StoreID
//REQUIRES: sid= StoreID      iTem= Item  qty= quanity that you would like to update
//MODIFIES: none
        updateStoreItem: function updateStoreItem(sid,itemname,qty) {
           
           this.searchStoreFilter(sid, itemname, function(returnedValue){
               //console.log(returnedValue);
        fetch(itemTableURL, {method: "Put", body: JSON.stringify({ItemID:returnedValue, Quantity:qty})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("Done!!");
        })
        .done();
           });
    }, 
        
//PURPOSE: Search from storeTable with async callback to obtain itemID 
//REQUIRES: sid= StoreID    itemName= name of the item   
//MODIFIES: ItemID 
        searchStoreFilter: function searchStoreFilter(sid,itemName,callback) {
           fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL&filter=StoreID%20%3D%20"+sid+"%20and%20Name%20%3D%20%22"+itemName+"%22", {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {    
             callback(responseData.record[0].ItemID);
        })
        .done();
    },

//PURPOSE: Format query to seach multiple stores
//REQUIRES: array of storeID
//MODIFIES: formatted query
    fetchMaker: function fetchMaker(array,callback) {
       var storeItemID= "http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL&filter=StoreID="+array[0];
       var i; 
       for(i=1;i<array.length;i++){
         storeItemID += "||StoreID="+array[i];
        
       }
        callback(storeItemID);
    },    

//PURPOSE: given array of storeID retrieve all items on sale
//Inputs: array  storeID
//output: array of items on sale   
    multipleStoreItemRetrieval: function multipleStoreItemRetrieval(array,callback){
        this.fetchMaker(array, function(returnValue){
            fetch(returnValue, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {    
              callback(responseData);
        })
        .done();
        }); 
    },      

});

module.exports = serverManager;
