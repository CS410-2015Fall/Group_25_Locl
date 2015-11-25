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

var BACKGROUND = '#a2ee6c';
var TEXT = '#effde4';
var BUTTON = '#7cca44';
var OUTLINE = '#d4f7bb';

var styles = StyleSheet.create({
                               description: {
                               fontFamily: 'Avenir',
                               color: TEXT,
                               backgroundColor: BACKGROUND,
                               fontSize: 24,
                               marginLeft: 40,
                               marginTop: 90,
                               },
                               icon:{
                               marginTop: 90,
                               marginLeft: 40,
                               borderWidth: 4,
                               borderColor: OUTLINE,
                               },
                               container: {
                               flex: 1,
                               backgroundColor: BACKGROUND,
                               },
                               flowRight: {
                               flexDirection: 'column',
                               alignItems: 'center',
                               alignSelf: 'stretch'
                               },
                               buttonText: {
                               marginTop: 20,
                               fontSize: 24,
                               color: TEXT,
                               alignSelf: 'center'
                               },
                               button: {
                               width: 100,
                               height: 100,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 16,
                               borderRadius: 100,
                               marginTop: 30,
                               marginBottom: 50,
                               marginLeft:37.5,
                               },
                               rowcontainer:{
                               marginTop: 0,
                               backgroundColor: BACKGROUND,
                               flexDirection: 'row',
                               alignItems: 'center',
                               alignSelf: 'stretch'
                               },
                               item:{
                               fontFamily: 'Avenir',
                               color: TEXT,
                               backgroundColor: BACKGROUND,
                               fontSize: 24,
                               marginLeft: 40,
                               marginTop: 20,
                               }
                               });

var StorePreferences = React.createClass({
                                 render(){
                                         return (<View style={styles.container}>
                                                 <Text style={styles.description}>
                                                 Add items:
                                                 </Text>
                                                 <Text style={styles.item}>></Text>
                                                 <Text style={styles.item}>></Text>
                                                 <Text style={styles.item}>></Text>
                                                 <TextInput style={{height: 40, width: 230, borderColor: OUTLINE, borderWidth: 4, marginBottom: 10, marginTop: 70, marginLeft: 40}}
                                                 onChange={this.onTextInputChange}/>
                                                 <View style={styles.rowcontainer}>
                                                 <TouchableHighlight style={styles.button} onPress={this.addItem}>
                                                 <Text style={styles.buttonText}>Add</Text>
                                                 </TouchableHighlight>
                                                 <TouchableHighlight style={styles.button} onPress={this.goToHome}>
                                                 <Text style={styles.buttonText}>Home</Text>
                                                 </TouchableHighlight>
                                                 </View>
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
                                 
                                 goToHome(){
                                 console.log("Going to home screen");
                                 }
                                 
                                 });

module.exports = StorePreferences;