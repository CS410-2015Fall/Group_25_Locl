'use strict';

var React = require('react-native');
var Preference = require('./Preference');
var StoreHome = require('./StoreHome');
var CustomerHome = require('./CustomerHome');
// If true, goes into the setup screen, not a home screen
var intro = true;
// If true, goes to store screen, otherwise customer screen
var customer = true;

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


var Welcome = React.createClass({
                           render(){
                           return (<View style={styles.container}>
                                   <Text style={styles.description}>
                                   Welcome to Locl
                                   </Text>
                                   <TouchableHighlight style={styles.button} onPress={this.loadPreference}>
                                   <Text style={styles.buttonText}>Choose my status</Text>
                                   </TouchableHighlight>
                                   </View>
                                   );
                           },
                           
                           loadPreference(){
                           this.props.navigator.push({
                                                     title: 'Preference',
                                                     component: Preference,
                                                     });
                           
                           }
                           
                           
                           });

var Customer = React.createClass({
                                render(){
                                return (<View style={styles.container}>
                                        <Text style={styles.description}>
                                        Welcome to Locl
                                        </Text>
                                        <TouchableHighlight style={styles.button} onPress={this.loadCustomerHome}>
                                        <Text style={styles.buttonText}>Choose my status</Text>
                                        </TouchableHighlight>
                                        </View>
                                        );
                                },
                                
                                loadCustomerHome(){
                                this.props.navigator.push({
                                                          title: 'CustomerHome',
                                                          component: CustomerHome,
                                                          });
                                
                                }
                                
                                
                                });
var Store = React.createClass({
                                 render(){
                                 return (<View style={styles.container}>
                                         <Text style={styles.description}>
                                         Welcome to Locl
                                         </Text>
                                         <TouchableHighlight style={styles.button} onPress={this.loadStoreHome}>
                                         <Text style={styles.buttonText}>Choose my status</Text>
                                         </TouchableHighlight>
                                         </View>
                                         );
                                 },
                                 
                                 loadStoreHome(){
                                 this.props.navigator.push({
                                                           title: 'StoreHome',
                                                           component: StoreHome,
                                                           });
                                 
                                 }
                                 
                                 
                                 });

var Locl = React.createClass({
                            render() {
                             if(intro){
                             
                             return (
                                     <NavigatorIOS ref='nav'
                                     style={styles.container}
                                     initialRoute={{
                                     title: 'Welcome',
                                     component: Welcome,
                                     }}/>
                                     );
                            
                             } else {
                             if(customer){
                             return (
                                     <NavigatorIOS ref='nav'
                                     style={styles.container}
                                     initialRoute={{
                                     title: 'Customer',
                                     component: Customer,
                                     }}/>
                                     );
                             
                            
                             } else {
                             return (
                                     <NavigatorIOS ref='nav'
                                     style={styles.container}
                                     initialRoute={{
                                     title: 'Store',
                                     component: Store,
                                     }}/>
                                     );
                             
                             }
                             }
                             }
                             });


AppRegistry.registerComponent('Locl', () => Locl);