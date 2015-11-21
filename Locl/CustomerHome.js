'use strict';

var React = require('react-native');
var CustomerAdd = require('./CustomerAdd');
var StorePage = require('./StorePage');
var bluetoothScanningManager = require('./bluetoothScanningManager.js');
var cacheManager = require('./cacheManager.js');
var serverManager = require('./serverManager.js');

var bt = false;

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
 container: {
  flex: 1,
  margin: 80,
  paddingTop      : 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF',
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
separator : {
 borderWidth  : .5,
 borderColor  : '#AEAEAE',
 height       : 1,
 width        : 300,
 marginBottom : 25
},
labelContainer : {
 flexDirection  : 'row',
 width          : 300
},
labelText : {
 paddingRight : 10,
 fontSize     : 18
},
textInput : {
 height      : 26,
 borderWidth : 0.5,
 borderColor : '#0f0f0f',
 padding     : 4,
 flex        : 1,
 fontSize    : 13,
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
formInput: {
 flex: 1,
 height: 26,
 fontSize: 13,
 borderWidth: 1,
 borderColor: "#555555",
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
});

var CustomerHome = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      minors: [], 
      currentAppState: AppStateIOS.currentState,
    };
  },

  //Before the rendering
  componentWillMount: function() {
    //get auth from the server
    serverManager.auth();
  },

  //Once it has rendered
  componentDidMount: function() {
    //Get current app state
    AppStateIOS.addEventListener('change', this._handleAppStateChange);

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

      console.log("Number of beacons: " + data.beacons.length);

      //Only send a request if there are beacons in the area
      if (data.beacons.length > 0) {

        var minors = Object.keys(data.beacons).map(f=>data.beacons[f].minor);
        console.log("Current minors: " + minors);
        console.log("Last minors: " + this.state.minors);

        //Only send a request if the current list of beacons is different from the last list of beacons
        console.log("Do the minors equal? " + (JSON.stringify(minors) == JSON.stringify(this.state.minors)));
        if (JSON.stringify(minors) !== JSON.stringify(this.state.minors)) {

          //Build the request string
          for (var i = 0; i < data.beacons.length; i++) {
            if (i == 0) {
              var storeRequestString= "http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/store?app_name=loclSQL&filter=StoreID=" + data.beacons[i].minor;
            } else {
              storeRequestString += "||StoreID=" + data.beacons[i].minor;
            }
          };

          console.log("Request String: " + storeRequestString);

          fetch(storeRequestString, {method: "GET"})
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.error) {
              console.log("Error: " + responseData.error);
            }
            else {
              console.log("Response Data:" + responseData.record);
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.record),
                minors: minors,
              })
            }}).done(); 
        }
      }
    });

}, 

render : function(){
  return (
    <View style={styles.container}>

    <Text style={styles.headline}>All stores in the area:</Text>

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
    <Text style={styles.title}>{store.StoreName}</Text>
    </TouchableHighlight>
    );
},

componentWillUnmount: function() {
  AppStateIOS.removeEventListener('change', this._handleAppStateChange);
},

_handleAppStateChange: function(currentAppState) {
  console.log("Current App State: "+ currentAppState);
  if (currentAppState == "background") {
    bluetoothScanningManager.stopRangingBeaconsInRegion();
  }
  if (currentAppState == "active") {
    bluetoothScanningManager.startRangingBeaconsInRegion();
  }
  this.setState({ currentAppState, });
},

//Navigation Functions 
toCustomerAdd(){
 this.props.navigator.push({
   title: 'CustomerAdd',
   component: CustomerAdd
 });
},

rowPressed(store) {
  console.log("Passed Store ID: " + store.StoreID);

  //Still need to stop ranging while they look at items...
  
  this.props.navigator.push({
   title: store.StoreName,
   component: StorePage,
   passProps: {storeID: store.storeID},
 });
}



});

module.exports = CustomerHome;
