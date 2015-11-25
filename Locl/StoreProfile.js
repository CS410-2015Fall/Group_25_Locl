var React = require('react-native');
var StorePreferences = require('./StorePreferences');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

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
} = React;

var styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
  },
  textField: {
    height: 40, 
    marginBottom: 2, 
    marginLeft: 2, 
    marginRight: 2,  
    borderColor: 'F5F5F5', 
    borderWidth: 1,
    paddingLeft: 2, 
  },
  textFieldTitle: {
    marginBottom: 2, 
    fontSize: 20,
    color: '#656565'
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
 thumb: {
  width: 200,
  height: 200,
  alignSelf: 'center',
},
});

var StoreProfile = React.createClass({
  render(){
    var top;
    var bottom;
    if (this.state.updateItem) {
      bottom = 
      <View style={styles.container}>

      <TouchableHighlight onPress={this.onUpdatePress}>
      <Text style={styles.button}>Update</Text>
      </TouchableHighlight>

      <TouchableHighlight onPress={this.onDeletePress}>
      <Text style={styles.button}>Close Store</Text>
      </TouchableHighlight>

      </View>;
    } else { 
      bottom = 
      <View style={styles.container}>

      <TouchableHighlight onPress={this.onCreatePress}>
      <Text style={styles.button}>Create</Text>
      </TouchableHighlight>

      </View>;
    }

    return (
      <ScrollView style={styles.container}>
      
      <TouchableHighlight onPress={this.onCameraPress}>
      <Image source={{uri: this.state.htmlLink}} style={styles.thumb}/>
      </TouchableHighlight>

      <Text style={styles.textFieldTitle}>Name:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({storeName: text})}
      value={this.state.storeName}
      />

      <Text style={styles.textFieldTitle}>Address:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({address: text})}
      value={this.state.address}
      />

      <Text style={styles.textFieldTitle}>Description:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({description: text})}
      value={this.state.description}
      />

      {bottom}
      
      </ScrollView>
      );
  },

  getInitialState: function() {
    if (this.props.StoreID) {
      return {
        updateItem: true,
        storeName: "",
        address: "",
        description: "",
        htmlLink: "http://mroliverblank.com/wp-content/uploads/2012/05/headline-lockup.png",
        storeID: this.props.StoreID,
      }
    } else {
      return {
        storeName: "",
        address: "",
        description: "",
        storeHTMLimg: "http://www.indre-reisid.ee/wp-content/themes/envision/lib/images/default-placeholder.png",
      }
    }
  },

  componentWillMount: function() {
    this.getStoreDetails(this.props.StoreID);
  },

  onUpdatePress: function()  {
    if(this.state.storeName == "" || this.state.address == "" || this.state.htmlLink == "") {
      AlertIOS.alert("Required fields missing");
    } else {
      fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/Store?app_name=loclSQL&filter=StoreID=" + this.state.storeID.toString(), 
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
     })
      .done()
      this.props.navigator.pop();
    }
  },

  onDeletePress: function() {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/Store?app_name=loclSQL&filter=StoreID="+ this.state.storeID, 
      {method: "DELETE"})
    .then((response) => response.json())
    .then((responseData) => {    
      AlertIOS.alert("Deleted Store");
    })
    .done();
    this.props.navigator.pop();
  },

  getStoreDetails: function(storeID) {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/store?app_name=loclSQL&filter=StoreID=" + storeID.toString(), {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.error) {
        console.log("Error: " + responseData.error);
      }
      else {
        this.setState({
          storeName: responseData.record[0].StoreName,
          address: responseData.record[0].Address,
          description: responseData.record[0].Description,
          htmlLink: responseData.record[0].StoreHTMLimg,
        })
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
    console.log('Response = ', response);
    if (didCancel) {
      console.log('User cancelled image picker');
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