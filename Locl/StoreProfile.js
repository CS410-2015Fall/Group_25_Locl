var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var CustomerHome = require('./CustomerHome.js');
var bluetoothBeaconManager = require('./bluetoothBeaconManager');
var defaultImage = "http://www.indre-reisid.ee/wp-content/themes/envision/lib/images/default-placeholder.png";

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
  ScrollView, 
  ListView,
  AlertIOS,
  AsyncStorage
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '8173c7',
    alignItems      : 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textField: {
    height: 40, 
    marginBottom: 2, 
    marginLeft: 10, 
    marginRight: 10,  
    borderColor: '#F5F5F5', 
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 2, 
  },
  textFieldTitle: {
    marginBottom: 2, 
    fontSize: 20,
    color: '#F5F5F5'
  },
  buttonText: {
   color: 'F5F5F5',
   fontSize: 18,
   alignSelf: 'center'
 },
 buttonBox : {
   borderColor : '#F5F5F5',
   justifyContent : 'center',
   alignItems     : 'center',
   padding        : 10,
   borderWidth    : 2,
   borderRadius   : 5
 },
 thumb: {
  width: 200,
  height: 200,
},
});

var StoreProfile = React.createClass({

  render() {
    var bottom;
    if (this.state.updateItem) {
      bottom = 
      <View style={styles.buttonContainer}>
      <TouchableHighlight style= {styles.buttonBox} onPress={this.onUpdatePress}>
      <Text style={styles.buttonText}>Update</Text>
      </TouchableHighlight>
      <TouchableHighlight style= {styles.buttonBox} onPress={this.onDeletePress}>
      <Text style={styles.buttonText}>Close Store</Text>
      </TouchableHighlight>
      </View>;
    } else { 
      bottom = 
      <TouchableHighlight style= {styles.buttonBox} onPress={this.onCreatePress}>
      <Text style={styles.buttonText}>Create</Text>
      </TouchableHighlight>;
    }

    return (
      <View style={styles.container}>
      
      <TouchableHighlight onPress={this.onCameraPress}>
      <Image source={{uri: this.state.htmlLink}} style={styles.thumb}/>
      </TouchableHighlight>

      <Text style={styles.textFieldTitle}> Name </Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({storeName: text})}
      value={this.state.storeName}
      />

      <Text style={styles.textFieldTitle}> Address </Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({address: text})}
      value={this.state.address}
      />

      <Text style={styles.textFieldTitle}> Description </Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({description: text})}
      value={this.state.description}
      />

      {bottom}
      
      </View>
      );
  },

  getInitialState: function() {
    console.log("Store profile this.props.CustomerId: " + this.props.CustomerId);
    //StoreID passed as prop if updating a store, otherwise there is no StoreID and we are creating a new store
    if (this.props.StoreID) {
      return {
        updateItem: true,
        storeName: "",
        address: "",
        description: "",
        htmlLink: defaultImage,
        storeID: this.props.StoreID,
      }
    } else {
      return {
        storeID: "",
        storeName: "",
        address: "",
        description: "",
        htmlLink: defaultImage,
        storeID: "",
      }
    }
  },

  componentWillMount: function() {
    if(this.props.StoreID){
      this.getStoreDetails(this.props.StoreID);
    } 
  },

  onUpdatePress: function()  {
    if(this.state.storeName == "" || this.state.address == "" || this.state.htmlLink == "") {
      AlertIOS.alert("Required fields missing");
    } else {
      fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/Store?app_name=loclSQL&filter=StoreID=" + this.state.storeID, 
        {method: "PUT", body: JSON.stringify({
          Address: this.state.address, 
          StoreName: this.state.storeName, 
          Description: this.state.description,
          StoreHTMLimg: this.state.htmlLink, 
          Transmitting: true})})
      .then((response) => response.json())
      .then((responseData) => {
        AlertIOS.alert("Store Updated");
      })
      .done(); 
      this.props.navigator.pop();
    }
  },

  onCreatePress: function() {
    var StoreHome = require('./StoreHome.js');
    if(this.state.storeName == "" || this.state.address == "" || this.state.htmlLink == "") {
      AlertIOS.alert("Required fields missing");
    } else {
      fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/store?app_name=loclSQL", 
        {method: "POST", body: JSON.stringify({
          StoreName: this.state.storeName, 
          Address: this.state.address, 
          Description: this.state.description,
          Transmitting: true,                
          StoreHTMLimg: this.state.htmlLink})}) 
      .then((response) => response.json())
      .then((responseData) => {
       AlertIOS.alert("Store Created");
       this.storeStoreID(responseData.StoreID);
       this.setState({
        storeID: responseData.StoreID,
      })
       this.updateCustomerWithStore(responseData.StoreID),
       bluetoothBeaconManager.onBeaconingSetPress(responseData.StoreID);
       this.props.navigator.replace({
        title: "Locl",
        component: StoreHome,
        passProps: {StoreID: responseData.StoreID}
      });
     })
      .done()
      
    }
  },

  updateCustomerWithStore: function updateCustomerWithStore(storeID) {
    console.log("Update customer with store: " + this.props.CustomerId);
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer?app_name=loclSQL&filter=CustomerID=" + this.props.CustomerId, {method: "PUT", body: JSON.stringify({StoreID: storeID})})
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Customer updated with StoreID");
    })
    .done();
  }, 


  async storeStoreID(newStoreID) {
    try {
      await AsyncStorage.setItem('StoreID', newStoreID.toString());
      console.log('StoreID ' + newStoreID + ' newStoreID');
    } catch (error) {
      console.log('AsyncStorage error (storeStoreID): ' + error.message);
    }
  },

  async removeStoreID(newStoreID) {
    try {
      await AsyncStorage.removeItem('StoreID');
      console.log('StoreID ' + newStoreID + ' removed');
    } catch (error) {
      console.log('AsyncStorage error (removeStoreID): ' + error.message);
    }
  },

  onDeletePress: function() {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/Store?app_name=loclSQL&filter=StoreID="+ this.state.storeID, 
      {method: "DELETE"})
    .then((response) => response.json())
    .then((responseData) => {    
      AlertIOS.alert("Closed Store");
      this.removeStoreID(this.state.StoreID);
    })
    .done();
    this.props.navigator.replace({
      component: CustomerHome,
    });
  },

  getStoreDetails: function(storeID) {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/store?app_name=loclSQL&filter=StoreID=" + storeID.toString(), {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.error) {
        console.log("Get Store Details Error: " + responseData.error);
      }
      else {
        console.log("Is object: " + typeof responseData.record[0]);
        if (typeof responseData.record[0] != 'object') {
          return;
        } else {
          this.setState({
            storeName: responseData.record[0].StoreName,
            address: responseData.record[0].Address,
            description: responseData.record[0].Description,
            htmlLink: responseData.record[0].StoreHTMLimg,
          })}
        }}).done(); 
  },

  // The first arg will be the options object for customization, the second is
  // your callback which sends bool: didCancel, object: response.
  // response.data is the base64 encoded image data
  // response.uri is the uri to the local file asset on the device
  // response.isVertical will be true if the image is vertically oriented
  // response.width & response.height give you the image dimensions
  onCameraPress: function() {
    var options = {
  title: 'Get Picture of Item', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  maxWidth: 480,
  maxHeight: 640,
  quality: 0.3,
  allowsEditing: true, // Built in iOS functionality to resize/reposition the image
  noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }}
  UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
    if (didCancel) {
      console.log('Image Picker Cancelled');
    }
    else {
      var source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
      this.setState({
        htmlLink: 'data:image/jpeg;base64,' + response.data,
      });
    }
  }
  )
},

});

module.exports = StoreProfile;