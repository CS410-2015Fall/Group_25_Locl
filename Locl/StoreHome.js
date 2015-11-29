'use strict';

var React = require('react-native');
var ItemPage = require('./ItemPage');
var bluetoothBeaconManager = require('./bluetoothBeaconManager.js');
var bluetoothScanningManager = require('./bluetoothScanningManager.js');

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

var BACKGROUND = '#a2ee6c';
var TEXT = '#effde4';
var BUTTON = '#7cca44';
var OUTLINE = '#d4f7bb';

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
  backgroundColor: BACKGROUND
 },
 resultsContainer: {
   flex: 2,
   backgroundColor: BACKGROUND
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
  flex: 1,
                               backgroundColor: BUTTON
},
separator: {
  height: 2,
  backgroundColor: BACKGROUND
},
price: {
  fontSize: 25,
  fontWeight: 'bold',
  color: TEXT,
                               marginLeft: 10,
},
title: {
                               fontSize: 20,
                               color: OUTLINE,
                               fontFamily: 'Avenir',
                               marginBottom: 10,
                               marginTop: 10,
                               textAlign: 'left',
},
                               addButton: {
                               fontSize: 20,
                               color: TEXT,
                               fontFamily: 'Avenir',
                               marginBottom: 10,
                               marginTop: 10,
                               marginLeft: 10,
                               textAlign: 'center',
                               },
rowContainer: {
  borderColor: BACKGROUND,
  borderWidth: 4,
  backgroundColor: BUTTON,
  flexDirection: 'row',
  padding: 10,
                               borderRadius: 8
},
                               topContainer: {
                               flexDirection: 'row',
                               alignItems: 'center',
                               alignSelf: 'stretch',
                               marginTop:70
                               },
                               text:{
                               fontSize: 20,
                               color: TEXT,
                               fontFamily: 'Avenir',
                               marginBottom: 10,
                               marginTop: 10,
                               marginLeft: 40
                               },
                               button:{
                               },
                               button3: {
                               width: 50,
                               height: 50,
                               backgroundColor: BUTTON,
                               borderColor: OUTLINE,
                               borderWidth: 4,
                               borderRadius: 100,
                               marginLeft:20
                               },
                               
                               pressedbutton3: {
                               width: 50,
                               height: 50,
                               backgroundColor: '#499711',
                               borderColor: OUTLINE,
                               borderWidth: 4,
                               borderRadius: 100,
                               marginLeft:20
                               },
                               icon:{
                               marginTop: 5,
                               marginLeft: 10
                               },
button: {
   height: 40,
   backgroundColor: BUTTON,
   borderColor: OUTLINE,
   borderWidth: 4,
   borderRadius: 8,
   margin: 5,
   color: TEXT,
   fontFamily: 'Avenir',
   alignSelf: 'stretch',
   justifyContent: 'center',
   fontSize: 18,
   textAlign: 'center',
                               marginTop: 10,
                               marginBottom: 10
 }, 
});
/* Removed in favor of button for now
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
*/

var StoreHome = React.createClass({
  render(){
    this.getStoreItems();
    return (
        <View style ={styles.container}>
        <View style = {styles.topContainer}>
        <Text style={styles.text}> Begin beaconing </Text>
            <TouchableHighlight style={this.pressColor()} onPress={this.alter}>
            <Image
            style={styles.icon}
            source={require('image!bluetooth')}
            />
            </TouchableHighlight>
              </View>
            <TouchableHighlight style={styles.button} onPress={this.onAddPress}>
            <Text style={styles.addButton}>Add Item</Text>
            </TouchableHighlight>
        <ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('Scrolling! Weeeee'); }}
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
                                  
                                  alter(){
                                  console.log('alter');
                                  this.setState({pressIn: !this.state.pressIn});
                                  
                                  if (this.state.pressIn) {
                                  bluetoothBeaconManager.onBeaconingStopPress();
                                  console.log("colorFalseSwitch set to value, bluetooth set to off");
                                  
                                  } else {

                                  this.setState({handling:false});
                                  AlertIOS.alert("Bluetooth beaconing will deactivate if your phone locks, or the application is not in the foreground. For best performance, disable locking and keep the application active on the screen.");
                                  console.log("colorTrueSwitch set to value, bluetooth set to on");

                                  
                                  }
                                  return this.pressColor();
                                  
                                  },
                                  
                                  pressColor: function() {
                                  if (this.state.pressIn) {
                                  return styles.pressedbutton3

                                  } else {
                                  return styles.button3

                                  }
                                  },

  handlePress: function(value) {
    console.log("handling Press");
    if (this.state.colorTrueSwitchIsOn) {
      this.setState({colorFalseSwitchIsOn: true, colorTrueSwitchIsOn: false});
      bluetoothBeaconManager.onBeaconingStopPress();
      console.log("colorFalseSwitch set to value, bluetooth set to off");
    } else {
      this.setState({colorTrueSwitchIsOn: true, colorFalseSwitchIsOn: false});
      bluetoothBeaconManager.onBeaconingStartPress();
      AlertIOS.alert("Bluetooth beaconing will deactivate if your phone locks, or the application is not in the foreground. For best performance, disable locking and keep the application active on the screen.");
      console.log("colorTrueSwitch set to value, bluetooth set to on");
    }
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
            colorTrueSwitchIsOn: false,
            colorFalseSwitchIsOn: true,

            //The storeID props need to come from the index.ios.js push (index.ios.js will get Async the stored StoreID, then pass it via props), for now it is being set to 101 temporarily
            // storeID: this.props.StoreID,

            StoreID: 101,
            dataSource: ds.cloneWithRows([]),
            currentAppState: AppStateIOS.currentState,
          };
  },

  componentWillMount: function() {
    bluetoothScanningManager.requestAlwaysAuthorization();
    bluetoothScanningManager.getAuthorizationStatus();
    this.getStoreItems();
    AppStateIOS.addEventListener('change', this.handleAppStateChange);
  },

  getStoreItems: function() {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/" + "item" + "?app_name=loclSQL" + "&filter=StoreID=" + this.state.StoreID, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {    
      if (responseData.error) {
        console.log("Error!");
        console.log(responseData.error);
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
      <Image style={styles.thumb} source={{ uri: itemData.HTMLimg }} />
      <View  style={styles.textContainer}>
      <Text style={styles.price}>${itemData.SalePrice}</Text>
      <Text style={styles.title} numberOfLines={1}>{itemData.Name}</Text>
      </View>
      </View>
      </TouchableHighlight>
      );
  },

  handleAppStateChange: function(currentAppState) {
  // if (currentAppState == "background") {
  //   bluetoothBeaconManager.onBeaconingStartPress();
  // }
  this.setState({currentAppState: AppStateIOS.currentState});
  console.log("App State: " + AppStateIOS.currentState);
  },


  onUpdatePress: function(itemData) {
    this.props.navigator.push({
      title: itemData.Name,
      component: ItemPage,
      passProps: {ItemData: itemData},
    });
  },

  onAddPress: function() {
    this.props.navigator.push({
      title: 'New Item',
      component: ItemPage,
      passProps: {ItemData: null, StoreID: this.state.StoreID.toString()},
    });
  },

  toBeacon(){
    this.props.navigator.push({
      title: 'Beacon',
      component: Beacon
    });
  },

});

module.exports = StoreHome;
