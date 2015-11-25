'use strict';

var React = require('react-native');
var ItemPage = require('./ItemPage.js');
var StoreProfile = require('./StoreProfile.js');
var bluetoothBeaconManager = require('./bluetoothBeaconManager.js');
var bluetoothScanningManager = require('./bluetoothScanningManager.js');
var serverManager = require('./serverManager.js');

var {
  AppStateIOS,
  ScrollView,
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
  AlertIOS,
  ListView,
  DeviceEventEmitter,
  AsyncStorage,
  SwitchIOS
} = React;

var styles = StyleSheet.create({
  description: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    marginTop: 30,
    flex: 1,
  },
  resultsContainer: {
    flex: 2,
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
  thumb: {
    width: 50,
    height: 50,
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
    borderColor: 'white',
    borderWidth: 1, 
    backgroundColor: 'F5F5F5',
    flexDirection: 'row',
    padding: 10
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

var StoreHome = React.createClass({
  render(){
    this.getStoreItems();
    return (
      <View style ={styles.container}>
      <SwitchIOS
      onValueChange={(value) => this.handlePress(value)}
      onTintColor="#00ff00"
      style={{marginBottom: 10}}
      thumbTintColor="#0000ff"
      tintColor="#ff0000"
      value={this.state.colorFalseSwitchIsOn} />
      <SwitchIOS
      onValueChange={(value) => this.handlePress(value)}
      onTintColor="#00ff00"
      thumbTintColor="#0000ff"
      tintColor="#ff0000"
      value={this.state.colorTrueSwitchIsOn} />

      <TouchableHighlight onPress={this.onDetailsPress}>
      <Text style={styles.button}>Store Details</Text>
      </TouchableHighlight>

      <TouchableHighlight onPress={this.onAddPress}>
      <Text style={styles.button}>Add Item</Text>
      </TouchableHighlight>

      <ScrollView
      automaticallyAdjustContentInsets={false}
      scrollEventThrottle={200}
      style={styles.scrollView}>
      <View style={styles.resultsContainer}>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow}
      />

      </View>
      </ScrollView>  
      </View>
      );
},

//This should eventually be a button
handlePress: function(value) {
  if (this.state.colorTrueSwitchIsOn) {
    this.setState({colorFalseSwitchIsOn: true, colorTrueSwitchIsOn: false});
    bluetoothBeaconManager.onBeaconingStopPress();
    AlertIOS.alert("Bluetooth Beaconing Deactivated");
  } else {
    this.setState({colorTrueSwitchIsOn: true, colorFalseSwitchIsOn: false});
    bluetoothBeaconManager.onBeaconingStartPress();
    AlertIOS.alert("Bluetooth Beaconing Activated. Bluetooth beaconing will deactivate if your phone locks, or the application is not in the foreground. For best performance, disable locking and keep the application active on the screen.");
  }
},

getInitialState: function() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  
  return {
    colorTrueSwitchIsOn: false,
    colorFalseSwitchIsOn: true,

    // StoreID: this.props.StoreID,
    storeID: 101,

    dataSource: ds.cloneWithRows([]),
    currentAppState: AppStateIOS.currentState,
  };
},

componentWillMount: function() {
  serverManager.auth();
  bluetoothScanningManager.requestAlwaysAuthorization();
  bluetoothScanningManager.getAuthorizationStatus();
  this.getStoreItems();
  AppStateIOS.addEventListener('change', this.handleAppStateChange);
},


getStoreItems: function() {
  fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/" + "item" + "?app_name=loclSQL" + "&filter=StoreID=" + this.state.storeID.toString(), {method: "GET"})
  .then((response) => response.json())
  .then((responseData) => {    
    if (responseData.error) {
      console.log("Get Store Items Error: " + responseData.error);
    }
    else {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData.record),
      })
    }
  })
  .done();
},

renderRow: function(itemData) {
  return (
    <TouchableHighlight underlayColor="#AA9999" onPress={() => this.onUpdatePress(itemData)}> 
    <View style={styles.rowContainer}>
    <Image style={styles.thumb} source={{ uri: itemData.HTMLlink}} />
    <View  style={styles.textContainer}>
    <Text style={styles.price}>${itemData.SalePrice}</Text>
    <Text style={styles.title} numberOfLines={1}>{itemData.Name}</Text>
    </View>
    </View>
    </TouchableHighlight>
    );
},

handleAppStateChange: function(currentAppState) {
  this.setState({currentAppState: AppStateIOS.currentState});
  console.log("App State: " + AppStateIOS.currentState);
},

onUpdatePress: function(itemData) {
  this.props.navigator.push({
    title: itemData.Name,
    component: ItemPage,
    passProps: {ItemData: itemData, StoreID: this.state.storeID,},
  });
},

onDetailsPress: function(){
  this.props.navigator.push({
    title: 'Store Details',
    component: StoreProfile,
    passProps: {StoreID: this.state.storeID,},
  });
},

onAddPress: function() {
  this.props.navigator.push({
    title: 'New Item',
    component: ItemPage,
    passProps: {ItemData: null, StoreID: this.state.storeID},
  });
},

});

module.exports = StoreHome;