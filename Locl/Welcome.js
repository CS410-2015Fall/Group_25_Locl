'use strict';

var React = require('react-native');
var Preference = require('./Preference');
var StoreHome = require('./StoreHome');
var CustomerHome = require('./CustomerHome');
var Tutorial = require('./Tutorial');

var Storage = require('react-native-store');
// If true, goes into the setup screen, not a home screen
// If true, goes to store screen, otherwise customer screen


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
                                
                                componentDidMount(){
                                // for debugging control flow
                                //this.debugIntro();
                                },
                                
                                async chooseScreen(){
                                try {
                                var intro = await this.loadIntro();
                                } catch (error){
                                console.log("Error loading type/intro");
                                }
                                
                                if(intro){
                                /*this.props.navigator.push({
                                                             title: 'Welcome',
                                                             component: Tutorial,
                                                             });*/
                                
                                } else {
                                try {
                                var customer = await this.loadType();
                                } catch (error){
                                console.log("Error loading type/intro");
                                }
                                if(customer){
                                this.props.navigator.replace({
                                                             title: 'Locl',
                                                             component: CustomerHome,
                                                             });
                                
                                
                                } else {
                                this.props.navigator.replace({
                                                             title: 'Locl',
                                                             component: StoreHome,
                                                             });
                                }
                                }
                                },


                                render() {
                                var chosen = this.chooseScreen();
                                return (
                                        <View style={styles.container}>
                                        <Text style={styles.description}>
                                        "Locl"
                                        </Text>
                                        <TouchableHighlight underlayColor="#AA9999" onPress={this.nextScreen} style={styles.button}>
                                        <View style={styles.container}>
                                        <Text style={styles.buttonText}>
                                        Begin
                                        </Text>
                                        </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight underlayColor="#AA9999" onPress={this.debugIntro} style={styles.button}>
                                        <View style={styles.container}>
                                        <Text style={styles.buttonText}>
                                        Set True
                                        </Text>
                                        </View>
                                        </TouchableHighlight>
                                        </View>);
                                },
                                
                                async nextScreen(){
                                try {
                                var intro = await this.loadIntro();
                                } catch (error){
                                console.log("Error loading type/intro");
                                }
                                
                             if(intro){
                             this.props.navigator.push({
                                     title: 'Welcome',
                                     component: Tutorial,
                                                       });
                             
                             } else {
                                try {
                                var customer = await this.loadType();
                                } catch (error){
                                console.log("Error loading type/intro");
                                }
                             if(customer){
                                     this.props.navigator.push({
                                     title: 'Locl',
                                     component: CustomerHome,
                                                               });
                             
                             
                             } else {
                                     this.props.navigator.push({
                                     title: 'Locl',
                                     component: StoreHome,
                                                               });
                             }
                             }
                            },
                             
                             async loadIntro(){
                                /* RNS version  */
                                var boolModel = await Storage.model("s");
                                
                                var add_intro = await boolModel.find({
                                                                     where:{name:"i"}
                                                                     });
                                
                                console.log(add_intro);

                                if (add_intro === null){
                                //var add_intro = await boolModel.add({name: "intro"});
                                console.log("Successful");
                                return true;
                                }
                                return false;
                                 
                                /* AS version
                                
                                try {
                                var type = await AsyncStorage.getItem("status");
                                if (type === "customer"){
                                return true;
                                } else {
                                return false;
                                }
                                } catch (error){
                                console.log("Couldn't determine type; tutorial disabled");
                              }
                                */

                             },
                             
                             async loadType(){
                                /* RNS version */
                                var boolModel = await Storage.model("s");
                                
                                var add_customer = await boolModel.find({
                                                                        where:{name:"c"}
                                                                     });
                                
                                var add_store = await boolModel.find({
                                                                        where:{name:"s"}
                                                                        });

                                console.log("Customer exists? " + add_customer);
                                console.log("Store exists? " + add_store);
                                if(add_customer === null){
                                console.log("Customer chosen");
                                return false;
                                }
                                console.log("Store chosen");
                                return true;
                                 
                                /* AS version
                                
                                try {
                                var type = await AsyncStorage.getItem("introduction");
                                if (type === null){
                                await AsyncStorage.setItem("introduction", "complete");
                                return true;
                                } else {
                                return false;
                                }
                                } catch (error){
                                console.log("Couldn't determine type; tutorial disabled");
                                }
                                  */
                             },
                                
                                async debugIntro(){
                                
                                /* RNS version */
                                var boolModel = await Storage.model("s");
                                
                                var remove_data = await boolModel.remove({
                                                                     where:{name:"i"}
                                                                     });
                                
                                var storeModel = await Storage.model("s");
                                
                                var store_data = await storeModel.remove({
                                                                         where:{name:"c"}
                                                                         });
                                
                                var custModel = await Storage.model("s");
                                
                                var cust_data = await custModel.remove({
                                                                     where:{name:"s"}
                                                                     });
                                
                                console.log("Customers left: " + cust_data);
                                console.log("Stores left: " + store_data);
                                console.log("Intro left: " + remove_data);
                                
                                
                                /* AS version
                                
                                try {
                                await AsyncStorage.clear();
                                }catch (error){
                                console.log("Couldn't clear cache; error");
                                }
                                 */
                                }
                                });


module.exports = Welcome;
