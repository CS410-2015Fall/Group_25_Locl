'use strict';

var React = require('react-native');

var {
  AlertIOS,
  ScrollView, 
  StyleSheet,
  Text,
  TextInput,
  View,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  NavigatorIOS,
  AppRegistry
} = React;

//app Name for DreamFactory
var loclSQL="?app_name=loclSQL";

//Basic Connection HTMLstrig for Database
var httpString="http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/";   

//String to connect to Items Table
var itemTableURL=httpString+"item"+loclSQL; 

var styles = StyleSheet.create({
 container: {
  marginTop: 10,
  flex: 1,
 },
 textField: {
  height: 40, 
  marginBottom: 2, 
  marginLeft: 2, 
  marginRight: 2,  
  borderColor: 'F5F5F5', 
  borderWidth: 1,
  paddingLeft: 2, 
 },
 textFieldTitle: {
  marginBottom: 2, 
  fontSize: 20,
  color: '#656565'
 },
 button: {
   height: 20,
   backgroundColor: 'grey',
   borderColor: 'grey',
   borderWidth: 1,
   borderRadius: 8,
   margin: 5,
   color: 'white',
   alignSelf: 'stretch',
   justifyContent: 'center',
   fontSize: 15,
   textAlign: 'center'
 }, 
});

var ItemPage = React.createClass({
  render(){
    var bottom; 
    if (this.state.updateItem) {
      bottom = 
      <View style={styles.container}>
      <TouchableHighlight onPress={this.onUpdatePress}>
                <Text style={styles.button}>Update</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.onDeletePress}>
            <Text style={styles.button}>Delete</Text>
        </TouchableHighlight>
        </View>;
    } else { 
      bottom = 
     <View style={styles.container}>
    <TouchableHighlight onPress={this.onAddPress}>
            <Text style={styles.button}>Add</Text>
        </TouchableHighlight>
        </View>;
      }

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.textFieldTitle}>Name:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({name: text})}
            value={this.state.name}
        />

        <Text style={styles.textFieldTitle}>UPC:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({upc: text})}
            value={this.state.upc}
        />

        <Text style={styles.textFieldTitle}>Quantity:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({quantity: text})}
            value={this.state.quantity}
        />

        <Text style={styles.textFieldTitle}>Regular Price:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({regPrice: text})}
            value={this.state.regPrice}
        />

        <Text style={styles.textFieldTitle}>Sale Price:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({salePrice: text})}
            value={this.state.salePrice}
        />

        <Text style={styles.textFieldTitle}>Description:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({description: text})}
            value={this.state.description}
        />

        <Text style={styles.textFieldTitle}>Start Date:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({startDate: text})}
            value={this.state.startDate}
        />

        <Text style={styles.textFieldTitle}>End Date:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({endDate: text})}
            value={this.state.endDate}
        />

        <Text style={styles.textFieldTitle}>Image Address:</Text>
        <TextInput
            style={styles.textField}
            onChangeText={(text) => this.setState({htmlImg: text})}
            value={this.state.htmlImg}
        />
        {bottom}
      </ScrollView>
      );
  },

  getInitialState: function() {

    if (this.props.ItemData) {
      return {
        updateItem: true,
        name: this.props.ItemData.Name,
        upc: this.props.ItemData.UPC.toString(),
        quantity: this.props.ItemData.Quantity.toString(),
        regPrice: this.props.ItemData.RegPrice.toString(),
        salePrice: this.props.ItemData.SalePrice.toString(),
        description: this.props.ItemData.Description,
        startDate: this.props.ItemData.StartDate,
        endDate: this.props.ItemData.EndDate,
        htmlImg: this.props.ItemData.HTMLimg,
      }
    } else {
      return {
        name: "",
        upc: "",
        quantity: "",
        regPrice: "",
        salePrice: "",
        description: "",
        startDate: "",
        endDate: "",
        htmlImg: "",
      }
    }
  },

  //Inputs:
  // [ { ItemID: 4,
  //     Name: 'Nike Shoes',
  //     UPC: 112233,
  //     RegPrice: 120,
  //     SalePrice: 100,
  //     Description: 'cheap nike shoes',
  //     StartDate: '11-22-23',
  //     EndDate: '11-23-23',
  //     Quantity: 2,
  //     StoreID: 101,
  //     HTMLimg: 'http://www.alegoo.com/images05/footwear/shoes-02/014/nike-basketball-shoes-12.jpg' } ] }
  
  //Waiting on Sheyrar for a proper Update Function
  onUpdatePress: function()  {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com:80/rest/db/item?ids="+this.props.ItemData.ItemID)
    .then((response) => response.json())
    .then((responseData) => {    
        console.log("Deleted Store Item");})
    .then(fetch(itemTableURL, {method: "POST", body: JSON.stringify({Name: this.state.name, Description: this.state.description, StartDate: this.state.startDate, EndDate: this.state.endDate, Quantity: this.state.quantity,  RegPrice: this.state.regPrice, SalePrice: this.state.salePrice, UPC: this.state.upc, StoreID:this.props.ItemData.StoreID, HTMLimg: this.state.htmlImg})})
    .then((response) => response.json())
    .then((responseData) => {
     console.log("Item Updated");
     AlertIOS.alert("Item Updated");
    }))
    .done()
    this.props.navigator.pop();
  },

  onAddPress: function() {
    fetch(itemTableURL, {method: "POST", body: JSON.stringify({Name: this.state.name, Description: this.state.description, StartDate: this.state.startDate, EndDate: this.state.endDate, Quantity: this.state.quantity,  RegPrice: this.state.regPrice, SalePrice: this.state.salePrice, UPC: this.state.upc, StoreID:this.props.StoreID, HTMLimg: this.state.htmlImg})})
    .then((response) => response.json())
    .then((responseData) => {
     console.log("Item Updated");
     AlertIOS.alert("Item Added");
    })
    .done()
    this.props.navigator.pop();
  },

  onDeletePress: function() {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com:80/rest/db/item?ids="+this.props.ItemData.ItemID)
    .then((response) => response.json())
    .then((responseData) => {    
        console.log("Item Deleted");
        AlertIOS.alert("Item Deleted");
      })
    .done();
    this.props.navigator.pop();
  },

});

module.exports = ItemPage;