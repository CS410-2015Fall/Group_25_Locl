'use strict';

var React = require('react-native');
var Preference = require('./Preference');
var Store = require('./Store');
var Customer = require('./Customer');
// If true, goes into the setup screen, not a home screen
var intro = 'true';
// If true, goes to store screen, otherwise customer screen
var customer = 'false';

console.log('k');

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
  AppRegistry,
  AsyncStorage
} = React;

var styles = require('./StyleIntro.js');


var Welcome = React.createClass({
                           render(){
                           return (<View style={styles.container}>
                                   <Image
                                   style={styles.icon}
                                   source={require('image!shopping_bag')}
                                   />
                                   <Text style={styles.description}>
                                   Welcome to Locl
                                   </Text>
                                   <TouchableHighlight style={styles.button} onPress={this.loadPreference}>
                                   <Text style={styles.buttonText}>Are you ready to begin your shopping experience?</Text>
                                   </TouchableHighlight>
                                   </View>
                                   );
                           },
                           
                           loadPreference(){
                                this.getType();
                           this.props.navigator.push({
                                                     title: 'Setup',
                                                     component: Preference,
                                                     });
                           
                           },
                                
                                async getType(){
                                try {
                                var out = await AsyncStorage.getItem('customer');
                                console.log(out);
                                } catch(error){
                                console.log(error.message);
                                }
                                },
                           
                           
                           });


var Locl = React.createClass({
                            render() {
                             console.log('Doing this');
                             var i = this.loadIntro();
                             //if(!i){
                             if (true){ //remove
                             
                            
                             var c = this.loadType();
                             //if(c){
                             if (false){ // remove
                             return (
                                     <NavigatorIOS ref='nav'
                                     style={styles.container}
                                     initialRoute={{
                                     title: 'Locl',
                                     component: Customer,
                                     }}/>
                                     );
                             
                             
                             } else {
                             return (
                                     <NavigatorIOS ref='nav'
                                     style={styles.container}
                                     initialRoute={{
                                     title: 'Locl',
                                     component: Store,
                                     }}/>
                                     );
                             
                             }
                          

                             } else {
                             
                             
                             return (
                                     <NavigatorIOS ref='nav'
                                     style={styles.container}
                                     initialRoute={{
                                     title: 'Welcome to Locl',
                                     component: Welcome,
                                     }}/>
                                     );
                             
                             }
                             },
                             
                             async loadIntro(){
                             try{
                             var ret = await AsyncStorage.getItem('intro');
                             console.log('Intro is: ' + ret);
                             if (ret == null || ret == 'true'){
                             await AsyncStorage.setItem('intro', 'false');
                             return true;
                             }
                             await AsyncStorage.setItem('intro', 'false');
                             return false;
                             } catch(error) {
                             console.log(error.message);
                             return false;
                             }
                             
                             },
                             
                             async loadType(){
                             try{
                             var ret = await AsyncStorage.getItem('customer');
                             console.log('Customer is: ' + ret);
                             if (ret == 'true'){
                             await AsyncStorage.setItem('customer', 'false');
                             return true;
                             }
                             return false;
                             } catch(error) {
                             console.log(error.message);
                             return true;
                             }
                             
                             },
                             
                             });


AppRegistry.registerComponent('Locl', () => Locl);
