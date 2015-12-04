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
} = React;

var styles = StyleSheet.create({
  description: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    marginTop: 50,
    flex: 1,
  },
  resultsContainer: {
    flex: 2,
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
    fontSize: 16,
    color: '#656565'
  },
  rowContainer: {
    borderColor: 'white',
    borderWidth: 1, 
    backgroundColor: 'F5F5F5',
    flexDirection: 'row',
    padding: 10
  }, 
  buttonText: {
   color: '8173c7',
   fontSize: 18,
   alignSelf: 'center'
 },
 buttonBox : {
   borderColor : '#8173c7',
   justifyContent : 'center',
   alignItems     : 'center',
   padding  : 10,
   borderWidth    : 2,
   borderRadius   : 5,
   margin: 20
 },
 customTabBar: {
  flexDirection: 'row',
  padding: 10,
  alignItems      : 'center',
  backgroundColor : '#8173c7',
  justifyContent: 'space-around',
  alignItems: 'flex-end',
},
customTab: {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around'
},
tabBarIcon: {
  height: 40,
  width: 40,
  resizeMode: 'stretch',
},
});

var StoreHome = React.createClass({
  render(){
    this.getStoreItems(this.props.StoreID);
    if(!this.state.bluetooth) {
      var bluetoothImage = <Image style={styles.tabBarIcon} source={require('image!blueetooth-3')} /> 
    } else {
      var bluetoothImage = <Image style={styles.tabBarIcon} source={require('image!blueetooth-2')} /> 
    }
    return (
      <View style ={styles.container}>
      <ScrollView
      automaticallyAdjustContentInsets={false}
      scrollEventThrottle={200}
      style={styles.scrollView}>
      <View style={styles.resultsContainer}>

      <TouchableHighlight style={styles.buttonBox} onPress={this.onAddPress}>
      <Text style={styles.buttonText}>Add a New Item</Text>
      </TouchableHighlight>
      
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow}
      />

      </View>
      </ScrollView> 
      <View style={styles.customTabBar}>

      <TouchableHighlight style={styles.customTab}>
      <Image style={styles.tabBarIcon} source={require('image!shop3')} /> 
      </TouchableHighlight>

      <TouchableHighlight style={styles.customTab} onPress={this.onBeaconingPress}>
      {bluetoothImage}
      </TouchableHighlight>

      <TouchableHighlight style={styles.customTab} onPress={this.onCustomerPress}>
      <Image style={styles.tabBarIcon} source={require('image!marker20')} /> 
      </TouchableHighlight>

      <TouchableHighlight style={styles.customTab} onPress={this.onSettingsPress}>
      <Image style={styles.tabBarIcon} source={require('image!settings48')} /> 
      </TouchableHighlight>
      </View>
      </View>
      );
},

getInitialState: function() {
  console.log("CustomerID passed to StoreHome: " + this.props.CustomerID);
  console.log("StoreID passed to StoreHome: " + this.props.StoreID);
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return {
    storeID: this.props.StoreID,
    dataSource: ds.cloneWithRows([]),
    currentAppState: AppStateIOS.currentState,
    bluetooth: false,
  } 
},

componentWillMount: function() {
  serverManager.auth();
  bluetoothScanningManager.requestAlwaysAuthorization();
  bluetoothScanningManager.getAuthorizationStatus();
  AppStateIOS.addEventListener('change', this.handleAppStateChange);
},

componentDidMount: function() {
  this.getStoreItems(this.props.StoreID);
},

getStoreItems: function(storeID) {
  fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/" + "item" + "?app_name=loclSQL" + "&filter=StoreID=" + storeID, {method: "GET"})
  .then((response) => response.json())
  .then((responseData) => {    
    if (responseData.error) {
      console.log("Get Store Items Error: " + responseData.error);
    }
    else {
      if (this.isMounted()) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.record),
        })}
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
  if (this.isMounted()){
    this.setState({currentAppState: AppStateIOS.currentState});
  }
  console.log("App State: " + AppStateIOS.currentState);
},

onBeaconingPress: function() {
  if (this.isMounted()) {
    if (this.state.bluetooth === true) {
      bluetoothBeaconManager.onBeaconingStopPress();
      AlertIOS.alert("Bluetooth Beaconing Deactivated");
      this.setState({
        bluetooth: false,
      });
    } else {
      bluetoothBeaconManager.onBeaconingStartPress();
      AlertIOS.alert("Bluetooth Beaconing Activated");
      this.setState({
        bluetooth: true,
      });
    }
  }
},

onStopBeaconingPress: function() {
  if (this.isMounted()) {
    bluetoothBeaconManager.onBeaconingStartPress();
    AlertIOS.alert("Bluetooth Beaconing Activated. Bluetooth beaconing will deactivate if your phone locks, or the application is not in the foreground. For best performance, disable locking and keep the application active on the screen.");
  }
},

onCustomerPress: function() {
  console.log("Firing onCustomerPress");
  var CustomerHome = require('./CustomerHome.js');
  bluetoothBeaconManager.onBeaconingStopPress();
  this.props.navigator.replace({
    title: "Locl",
    component: CustomerHome,
    passProps: {StoreID: this.props.StoreID, CustomerID: this.props.CustomerID}
  });
},

onUpdatePress: function(itemData) {
  bluetoothBeaconManager.onBeaconingStopPress();
  this.setState({
    bluetooth: false,
  });
  this.props.navigator.push({
    title: itemData.Name,
    component: ItemPage,
    passProps: {ItemData: itemData, StoreID: this.state.storeID,},
    leftButtonTitle: 'Inventory',
    onLeftButtonPress: () => {this.props.navigator.pop();}
  });
},

onSettingsPress: function(){
  bluetoothBeaconManager.onBeaconingStopPress();
  this.setState({
    bluetooth: false,
  });
  this.props.navigator.push({
    title: 'Change Store Information',
    component: StoreProfile,
    passProps: {StoreID: this.state.storeID,},
    leftButtonTitle: 'Inventory',
    onLeftButtonPress: () => {this.props.navigator.pop();}
  });
},

onAddPress: function() {
  bluetoothBeaconManager.onBeaconingStopPress();
  this.setState({
    bluetooth: false,
  });
  this.props.navigator.push({
    component: ItemPage,
    title: "Add a New Item",
    passProps: {ItemData: '', StoreID: this.state.storeID},
    leftButtonTitle: 'Inventory',
    onLeftButtonPress: () => {this.props.navigator.pop();}
  });
},

});

module.exports = StoreHome;