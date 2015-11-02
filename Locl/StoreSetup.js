'use strict';

var React = require('react-native');
var StoreList = require('./StoreList');

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

var StoreSetup = React.createClass({
                                    render(){
                                    return (<View style={styles.container}>
                                            <Text style={styles.description}>
                                            Setup your store page:
                                            </Text>
                                            <TouchableHighlight style={styles.button} onPress={this.toStoreList}>
                                            <Text style={styles.buttonText}>Proceed</Text>
                                            </TouchableHighlight>
                                            </View>);
                                    },
                                    
                                    toStoreList(){
                                      this.props.navigator.push({
                                                                title: 'StoreList',
                                                                component: StoreList
                                      });
                                    }
                                    
                                    });

module.exports = StoreSetup;