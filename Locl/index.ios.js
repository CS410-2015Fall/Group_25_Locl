'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  AlertIOS,
} = React;
    
        
//Variable used through the file
//Mostly for formatting URL that will be used to query database
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
    
    

//CAUTION!!!!
//README!!!!
//Just using sample buttons for testing the methods. Not USEFULL otherwise.
var Locl = React.createClass({
  render: function() {
    return (
   <View style={styles.container}>
        <TouchableHighlight onPress={this.createItem("PS4","come buy cheap","11-23-11","11-24-13",3,340,400,8,1234123,"www.google.com")} style={styles.button}>
                    <Text>Get</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.auth()} style={styles.button}>
                    <Text>Auth</Text>
                </TouchableHighlight>
            </View>
    );
  },
//CAUTION!!!! END
//README!!!!  END    
      
      

//Authorization function. 
//Only need to run this once when the app first starts up
//grants the client access to read and write to database
//DO NOT CHANGE just call fucntion once and it will do the rest
        auth: function() {
        fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/user/session?app_name=loclSQL", {method: "POST", body: JSON.stringify({"email":"locl@user.com","password":"rootadmin"})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("Search Query -> " + responseData.session_id)
        }) 
        .done()
    },
        
    
   

//Create User function. 
//Inputs: fName= First Name(String)    lName= Last Name(String)    pass= Password(String)    
//output:none
//note: Null items are allowed. if user doesnot enter just leave fields blank and the database will store as iTem=null.
        createCustomer: function(fName,lName,pass) {
        fetch(customerTableURL, {method: "POST", body: JSON.stringify({FirstName:fName, LastName: lName, Password:pass})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("DONE");
        })
        .done();
    },
        
        
        
//Create Store fucntion. 
//Inputs: sName= Store Name(String)    sAddress= Store Address(String)    transmitting= True or False(Boolean)
//        StoreHTMLimg= URL link with Store image(string)
//output:none
//note: sName must be unique and cannot be same as others. trans must be true or false cannot be null.
        createStore: function(sName,sAddress,transmitting,sImage) {
        fetch(storeTableURL, {method: "POST", body: JSON.stringify({StoreName: sName, Address: sAddress, Transmitting: transmitting, StoreHTMLimg: sImage})})
        .then((response) => response.json())
        .then((responseData) => {
            console.log("DONE");
        })
        .done();
    },

       
        
//Create CustomerItem fucntion. 
//Inputs: itemName= Name of preference Item(Integer)       customerID= Existing CustomerID(Integer)
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
          
        
        
//Create StoreItem function. 
//Inputs: name= Store Name(String)  desc= Store Description(String)  sDate= Start Date(String)   eDate= End Date(String)  
//        qty= Quantity(Integer)   regPrice = Regular Price(Integer)   sPrice= Sale Price(Integer)    sID= StoreID(Integer) 
//        upc= UPC(Integer)   imgLink= HTTP Image Link(String)
//output:none
//note: sID must be and existing value in store table. HTMLimg can be null or set to a specific link.       
        createStoreItem: function(name,desc,sDate,eDate,qty,regPrice,salePrice,sID,upc,imgLink) {
        fetch(itemTableURL, {method: "POST", body: JSON.stringify({Name: name, Description:desc,StartDate:sDate,EndDate:eDate,Quantity:qty, RegPrice:regPrice,SalePrice: salePrice, UPC: upc, StoreID:sID,HTMLimg:imgLink})})
        .then((response) => response.json())
        .then((responseData) => {
             console.log("DONE");
        })
        .done();
    },
        
//Compare Store Items to User Items and check for any matches. 
//Inputs: custID= CustomerID(Integer)     storeID=StoreID(Integer)
//output: Boolean(true or false)
//note: if a storeID or custID does not exist and it is passed as a parameter the program will return farlse
//      you would simply enter searchByOneFilter("nasrin","FirstName",customerTableURL)      
        
        checkItemLists: function(custID,storeID) {
        fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/system/script/add?app_name=loclSQL&is_user_script=true&CustID="+custID+"&StoreID="+storeID, {method: "POST"})
        .then((response) => response.json())
        .then((responseData) => {
             console.log("Search Query server -> " + responseData.script_result)
        })
        .done();
    },
        
//Search from any table with 1 filter function. 
//Inputs: fval= Filter Value(String)   ftype= Filter Name(String)  ftable= is one of (customerTableURL/itemTableURL/storeTableURL)
//output: Array of Results based on search. Null if array has no results.
//note: so if you want to search from table customer table, by first name and lets say a user by the FirstName of nasrin
//      you would simply enter searchByOneFilter("nasrin","FirstName",customerTableURL)
        searchByOneFilter: function searchByOneFilter(fval,fname,ftable) {
        fetch(ftable+searchByStart+fname+searchByMid+fval+searchByEnd, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {    
            console.log("CustName:--->"+responseData.record[0].ItemName)
        })
        .done();
    },
//-----------------------------------------------------------------------------------------------------------------------------------------
////Update CustomerPreferenceItem Given CustomerID
////Inputs: cID= CustomerID      iTem= PreferenceItem
////output: none
////note: so if you want to add a new item for customer with id 4 on position item2 with a new value of "shorts". 
////      you would simply call updateCustomerItem(4,"shorts")
//        updateCustomer: function(cID,iTem) {
//        fetch(customerItemURL, {method: "Put", body: JSON.stringify({CustomerID:cID,ItemName:iTem})})
//        .then((response) => response.json())
//        .then((responseData) => {
//        })
//        .done();
//    }      
//-----------------------------------------------------------------------------------------------------------------------------------------    
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
   backgroundColor: '#eeeeee',
   padding: 10,
   marginRight: 5,
   marginLeft: 5,
    }
});

AppRegistry.registerComponent('Locl', () => Locl);
