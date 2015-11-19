'use strict';

var React = require('react-native');
var items = [];
var toAdd = "";

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
   margin: 80
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
 }
});

var StoreAdd = React.createClass({
 render(){
   return (<View style={styles.container}>
     <Text style={styles.description}>
     Add items:
     </Text>
     <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}
     onChange={this.onTextInputChange}/>
     <TouchableHighlight style={styles.button} onPress={this.addItem}>
     <Text style={styles.buttonText}>Add</Text>
     </TouchableHighlight>
     </View>);
 },
 
 addItem(){
  if (items.length < 5){
    items.push(toAdd);
    console.log(items.pop());
  }
},

onTextInputChange(event) {
  toAdd = event.nativeEvent.text;
},

});

module.exports = StoreAdd;