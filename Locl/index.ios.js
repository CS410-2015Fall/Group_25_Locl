/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;
    
        
//Variable used through the file
//Mostly for formatting URL that will be used to query database
//app Name for DreamFactory
var loclSQL="?app_name=loclSQL";
//Basic Connection HTMLstrig for Database
var httpString="http://ec2-52-88-97-209.us-west-2.compute.amazonaws.com/rest/db/";   
//String to connect to Items Table
var itemTableURL=httpString+"item"+loclSQL;   
//String to connect to Customer Table
var customerTableURL=httpString+"customer"+loclSQL; 
//Sting to connect to Store Table
var storeTableURL=httpString+"store"+loclSQL;
//Search by name variable
var searchByStart="&filter=";  
var searchByMid="%20%3D%20%22";   
var searchByEnd="%22";   


var Locl = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  },
      

//Authorization function. 
//Only need to run this once when the app first starts up
//grants the client access to read and write to database
//DO NOT CHANGE just call fucntion once and it will do the rest
        auth: function() {
        fetch("http://ec2-52-88-97-209.us-west-2.compute.amazonaws.com/rest/user/session?app_name=loclSQL", {method: "POST", body: JSON.stringify({"email":"locl@user.com","password":"rootadmin"})})
        .then((response) => response.json())
        .then((responseData) => {
        })        
    },
    

//Create User function. 
//Inputs: fName= First Name    lName= Last Name    pass= Password    
//output:none
//note: Null items are allowed. if user doesnot enter just leave fields blank and the database will store as iTem=null.
        createUser: function(fName,lName,pass,iTem1,iTem2,iTem3) {
        fetch(customerTableURl, {method: "POST", body: JSON.stringify({FirstName:fName, LastName: lName, Password:pass})})
        .then((response) => response.json())
        .then((responseData) => {
        })
        .done();
    },
        
//Create Store fucntion. 
//Inputs: sName= Store Name    sAddress= Store Address    trans= True or False      StoreHTMLimg= URL link with Store image
//output:none
//note: sName must be unique and cannot be same as others. trans must be true or false cannot be null.
        creatStore: function(sName,sAddress,trans,sImage) {
        fetch(storeTableURl, {method: "POST", body: JSON.stringify({StoreName: sName, Address: sAddress, Transmitting: trans, StoreHTMLimg: sImage})})
        .then((response) => response.json())
        .then((responseData) => {
        })
        .done();
    },
        
//Create Item function. 
//Inputs: name= Store Name  desc= Store Description  sDate= Start Date   eDate= End Date  qty= Quantity   regPrice = Regular Price  
//        sPrice= Sale Price    sID= StoreID   upc= UPC   imgLink= HTTP Image Link
//output:none
//note: sID must be and existing value in store table. HTMLimg can be null or set to a specific link.       
        createItem: function(name,desc,sDate,eDate,qty,regPrice,salePrice,sID,upc,imgLink) {
        fetch(itemTableURL, {method: "POST", body: JSON.stringify({Name: name, Description:desc,StartDate:sDate,EndDate:eDate,Quantity:qty, RegPrice:regPrice,SalePrice: salePrice, UPC: upc, StoreID:sID,HTMLimg:imgLink})})
        .then((response) => response.json())
        .then((responseData) => {
        })
        .done();
    },
        
//Search from any table with 1 filter function. 
//Inputs: fval= Filter Value   ftype= Filter Name  ftable= is one of customerTableURL/itemTableURL/storeTableURL
//output: Array of Results based on search. Null if array has no results.
//note: so if you want to search from table customer table, by first name and lets say a user by the FirstName of nasrin
//      you would simply enter searchByOneFilter("nasrin","FirstName",customerTableURL)
        searcByOneFilter: function searchByOneFilter(fval,fname,ftable) {
        fetch(ftable+searchByStart+fname+searchByMid+fval+searchByEnd, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {    

               return responseData.record[0].FirstName     
        })
        .done();
    },
//Update customer items Given CustomerID
//Inputs: cID= CustomerID      iTem= PreferenceItem
//output: none
//note: so if you want to add a new item for customer with id 4 on position item2 with a new value of "shorts". 
//      you would simply call updateCustomerItem(4,"shorts")
        updateCustomer: function(cID,iTem) {
        fetch(customerTableURl, {method: "Put", body: JSON.stringify({CustomerID:cID,Item1:iTem})})
        .then((response) => response.json())
        .then((responseData) => {
        })
        .done();
    }      
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
});

AppRegistry.registerComponent('Locl', () => Locl);
