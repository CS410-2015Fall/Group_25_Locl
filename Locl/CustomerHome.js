'use strict';

var React = require('react-native');
var CustomerAdd = require('./CustomerAdd');
var StorePage = require('./StorePage');
var bluetoothScanningManager = require('./bluetoothScanningManager.js');
var cacheManager = require('./cacheManager.js');
var serverManager = require('./serverManager.js');

var {
  AppStateIOS,
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
  ListView,
  DeviceEventEmitter,
} = React;

var styles = StyleSheet.create({
 description: {
   color: 'black',
   backgroundColor: 'white',
   fontSize: 30,
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
 },
 instructionsText : {
   fontSize : 20
 },
 labelContainer : {
   flexDirection  : 'row',
   width          : 300
 },
 labelText : {
   paddingRight : 10,
   fontSize     : 18
 },
 buttonContainer : {
   flexDirection  : 'row',
   justifyContent : 'center',
   alignItems     : 'center',
   marginTop      : 20
 },
 touchableHighlight : {
   marginLeft  : 10,
   marginRight : 10,
 },
 buttonBox : {
   flexDirection  : 'row',
   justifyContent : 'center',
   alignItems     : 'center',
   padding        : 10,
   borderWidth    : 2,
   borderRadius   : 5
 },
 saveButtonBox : {
   borderColor : '#AA0000'
 },
 loadButtonBox : {
   borderColor : '#00AA00'
 },
 setButtonBox : {
   borderColor : '#00AA00'
 },
 buttonText : {
   fontSize : 16,
 },
 outputContainer : {
   width          : 300,
   height         : 200,
   justifyContent : 'center',
   alignItems     : 'center',
   borderWidth    : .5,
   borderColor    : "#999999",
   marginTop      : 20
 }, 
 row: {
   padding: 8,
   paddingBottom: 16
 }, 
 smallText: {
   fontSize: 11
 },
 saved: {
   fontSize: 20,
   textAlign: "center",
   margin: 10,
 },
 headline: {
  fontSize: 20,
  paddingTop: 20
},
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

var CustomerHome = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      minors: [], 
      currentAppState: AppStateIOS.currentState,
  }
  },

  //Before the rendering
  componentWillMount: function() {
    //get auth from the server
    serverManager.auth();
    bluetoothScanningManager.getAuthorizationStatus();
    bluetoothScanningManager.setupStatusSubscription();
    bluetoothScanningManager.startMonitoringForRegion();
    bluetoothScanningManager.startUpdatingLocation();
  },

  //Once it has rendered
  componentDidMount: function() {

    //Get current app state
    AppStateIOS.addEventListener('change', this.handleAppStateChange);

    //Stop listening if there isn't any stores around
    bluetoothScanningManager.setupStopSubscription();

    //Restart listening if there are stores around
    bluetoothScanningManager.setupRestartSubscription();

    //Start scanning
    bluetoothScanningManager.startRangingBeaconsInRegion();

  //Subscribe to listening (cannot refactor into bluetoothScanningManager as of yet - Corey)
  var startSubscription = DeviceEventEmitter.addListener(
    'beaconsDidRange',
    (data) => {
      console.log("Beacons: " + data.beacons.length);
      if (data.beacons.length > 0) {
        //Only send a request if the current list of beacons is different from the last list of beacons
        var minors = Object.keys(data.beacons).map(f=>data.beacons[f].minor);
        if (JSON.stringify(minors) !== JSON.stringify(this.state.minors)) {
          console.log("Minors do not equal");
          //Build the request string
          for (var i = 0; i < data.beacons.length; i++) {
            if (i == 0) {
              var storeRequestString= "http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/store?app_name=loclSQL&filter=StoreID=" + data.beacons[i].minor;
            } else {
              storeRequestString += "||StoreID=" + data.beacons[i].minor;
            }
          };

          fetch(storeRequestString, {method: "GET"})
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.error) {
              console.log("Error: " + responseData.error);
            }
            else {
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.record),
                minors: minors,
              })
            }}).done(); 
        }
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows([]),
          minors: [],
        })
      } 
    });
}, 

render : function(){
  return (
    <View style={styles.container}>
    <ListView
    dataSource={this.state.dataSource}
    renderRow={this.renderStore}
    />
    </View>
    )
},

renderStore: function(store) {
  return (
    <TouchableHighlight underlayColor="#AA9999" onPress={() => this.rowPressed(store)}> 
    <View>
    <View style={styles.rowContainer}>
    <Image style={styles.thumb} source={{ uri: store.StoreHTMLimg }} />
    <View  style={styles.textContainer}>
    <Text style={styles.title} 
    numberOfLines={1}>{store.StoreName}</Text>
    </View>
    </View>
    <View style={styles.separator}/>
    </View>
    </TouchableHighlight>
    );
},

componentWillUnmount: function() {
  AppStateIOS.removeEventListener('change', this.handleAppStateChange);
},

handleAppStateChange: function(currentAppState) {
  if (currentAppState == "background") {
    bluetoothScanningManager.stopRangingBeaconsInRegion();
  }
  if (currentAppState == "active") {
    bluetoothScanningManager.startRangingBeaconsInRegion();
  }
  this.setState({currentAppState: AppStateIOS.currentState});
},

toCustomerAdd(){
 this.props.navigator.push({
   title: 'CustomerAdd',
   component: CustomerAdd
 });
},

rowPressed(store) {
  //Still need to stop ranging while they look at items...
  bluetoothScanningManager.stopRangingBeaconsInRegion();
  this.props.navigator.push({
   title: store.StoreName,
   component: StorePage,
   passProps: {StoreID: store.StoreID},
   leftButtonTitle: 'Back to Store',
   onLeftButtonPress: () => {this.props.navigator.pop(), bluetoothScanningManager.startRangingBeaconsInRegion();}
 });
}

});

module.exports = CustomerHome;
