'use strict';

var React = require('react-native');

var {
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

var styles = StyleSheet.create({
 description: {
   color: 'black',
   backgroundColor: 'white',
   fontSize: 30,
   margin: 80
 },
 container: {
   flex: 1,
 },
 flowRight: {
   flexDirection: 'column',
   alignItems: 'center',
   alignSelf: 'stretch'
 },
 buttonText: {
   fontSize: 18,
   color: 'white',
   alignSelf: 'center'
 },
 button: {
   height: 20,
   flex: 1,
   flexDirection: 'row',
   backgroundColor: '#48BBEC',
   borderColor: '#48BBEC',
   borderWidth: 1,
   borderRadius: 8,
   marginBottom: 10,
   alignSelf: 'stretch',
   justifyContent: 'center'
 }, 
 thumb: {
  width: 80,
  height: 80,
  marginRight: 10
},
textContainer: {
  flex: 1
},
separator: {
  height: 1,
  backgroundColor: '#dddddd'
},
price: {
  fontSize: 25,
  fontWeight: 'bold',
  color: '#48BBEC'
},
title: {
  fontSize: 20,
  color: '#656565'
},
rowContainer: {
  flexDirection: 'row',
  padding: 10
}
});

var StorePage = React.createClass({
  render(){
    return (
      <View style={styles.container}>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow}
      />
      </View>);
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      storeID: this.props.StoreID,
      dataSource: ds.cloneWithRows([]),
    };
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
  //Output: HTML for each row
  renderRow: function(itemData) {
    return (
      <View>
      <View style={styles.rowContainer}>
      <Image style={styles.thumb} source={{ uri: itemData.HTMLlink }} />
      <View  style={styles.textContainer}>
      <Text style={styles.price}>${itemData.SalePrice}</Text>
      <Text style={styles.title} 
      numberOfLines={1}>{itemData.Name}</Text>
      </View>
      </View>
      <View style={styles.separator}/>
      </View>
      );
  },

  componentWillMount: function() {
    this.getStoreItems();
  },

  getStoreItems: function() {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/" + "item" + "?app_name=loclSQL" + "&filter=StoreID=" + this.props.StoreID, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {    
      if (responseData.error) {
        console.log("Error!");
        console.log(responseData.error);
      }
      else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.record),
        })
      }
    })
    .done();
  }
});

module.exports = StorePage;