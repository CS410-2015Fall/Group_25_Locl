'use strict';

var React = require('react-native');
var CustomerAdd = require('./CustomerAdd');
var StorePage = require('./StorePage');
var bluetoothScanningManager = require('./bluetoothScanningManager.js');
var cacheManager = require('./cacheManager.js');
var serverManager = require('./serverManager.js');

var bt = false;

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

var BeaconView = React.createClass({
  render: function() {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>Name: {serverManager.getStoreDetails(this.props.uuid)}</Text>
        <Text style={styles.smallText}>Picture {} </Text>
        <Text style={styles.smallText}>UUID: {this.props.uuid}</Text>
        <Text style={styles.smallText}>Major: {this.props.major}</Text>
        <Text style={styles.smallText}>Minor: {this.props.minor}</Text>
        <Text>RSSI: {this.props.rssi}</Text>
        <Text>Proximity: {this.props.proximity}</Text>
        <Text>Distance: {this.props.accuracy.toFixed(2)}m</Text>
      </View>
    );
  }
});

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var CustomerHome = React.createClass({

getInitialState: function() {
    return {
      dataSource: ds.cloneWithRows([]),
    };
  },

componentWillMount: function() {
  //get auth from the server
  serverManager.auth();

  //Start listening
  bluetoothScanningManager.startRangingBeaconsInRegion();

  //Subscribe to listening (cannot refactor into bluetoothScanningManager as of yet - Corey)
  var startSubscription = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        // Set the dataSource state with the whole beacon data
        // We will be rendering all of it throug <BeaconView />
        this.setState({
          dataSource: ds.cloneWithRows(data.beacons)
        });
        console.log(data.beacons);
      }
    );

  //Stop listening if there isn't any stores around
  bluetoothScanningManager.setupStopSubscription();
  
  //Restart listening if there are stores around
  bluetoothScanningManager.setupRestartSubscription();

},

//Functions for displaying stores in the area
renderRow : function(rowData) {
    return <BeaconView {...rowData} style={styles.row} />
},

render : function(){
   return (
      <View style={styles.container}>

      <Text style={styles.headline}>All stores in the area:</Text>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
      </View>
      )
},

//Navigation Functions 
toCustomerAdd(){
 this.props.navigator.push({
   title: 'CustomerAdd',
   component: CustomerAdd
 });
},

toStorePage(){
 this.props.navigator.push({
   title: 'StorePage',
   component: StorePage
 });
},


 
});

module.exports = CustomerHome;
