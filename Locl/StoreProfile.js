var React = require('react-native');
var StorePreferences = require('./StorePreferences');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var CustomerHome = require('./CustomerHome.js');

var defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAIAAAC6s0uzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMTA3OUM4M0JBOEMxMUUyODk1OUUwMDM4ODMyNkMyQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMTA3OUM4NEJBOEMxMUUyODk1OUUwMDM4ODMyNkMyQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxMDc5QzgxQkE4QzExRTI4OTU5RTAwMzg4MzI2QzJCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxMDc5QzgyQkE4QzExRTI4OTU5RTAwMzg4MzI2QzJCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+hmM2mwAAD65JREFUeNrs3elvVPW/wHGhm0YtGi9gIsaYGDVGRSVuaIya+MRoYpQnPvQ/EwRqN5ZCRcPWli5QWlq2QosFupe22GlLOzPtzPSeC7lcLz/Ezsp0eL0emKbMnJn59Nh3zyznW9zX1/cYAJBba40AAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAQYAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgAEGAAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYABBgABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAQYAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgAEGAAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYABBgABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAQYAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgAEGAAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYABBgABBgABBgAECAAUCAAQABBgABBgAEGABWkWIjIP91dXXFYrGioiKjYCXi8XhpaenmzZuNAgGGtBw6dCgSiRQX211ZkeDPtSeffFKAEWBIVzgcTiQSwWGNUbBCCwsLhkCe8xowq4Ann7HPIMAAgAADgAADAAIMAAIMAAgwAAgwAAgwACDAACDAAIAAA4AAAwACDAACDAD8f9YDpgCVlpZ+/vnnL774YjQaNY1Vf5Swdm0sFjt06ND09LRpIMCQ37t1cfHrr7++ceNGoygYTU1NAkyh/XFpBBSe5eXlcDhsDgUjOAKOx+PmgAADAAIMAAIMAAgwAAgwACDAACDAACDAAIAAA4AAAwAZ4FzQwIrMz89fu3ZtfHw8+CKRSJSUlDz99NObNm166aWXiov9JgEBBjJtaGioo6Ojv79/bm4uFov9/Z/KysrWrVv31ltvffDBB0899ZRZgQADGRAOhxsbG0+ePLm0tHTfC0Sj0YmJiaNHj3Z3d3/yySfvv//+2rVe2AIBBtIQCoWqqqoGBgZWcuGbN2/W1dWNjo5+8803JSUlpgcCDKRibm5u+/btwdFtUtfq6OgIjpW3bdvmOBj+lf9JgHstLi4Gx77J1veOs2fPHj9+3AxBgIGknTp16urVqylfvaGhYXBw0BhBgIEkhEKhlpaWdLaQSCSam5uD/xomCDCwUhcvXpybm0tzI5cvXx4dHTVMEGAgiXamv5F4PN7f32+YIMDAioRCocnJyYxsanh4+J6zdgACDNzf1NRUNBrNyKamp6cztSkQYKDARSKRTL15KhwOOwIGAQZybc2aNYYAAgysyOOPP56pk1gFm7JKEggwZFEhPdH63HPPZepMzuXl5aWlpXYPEGDIilAoVFNTc+PGjcJ4OM8+++z69eszsqlNmzZZlQEEGLKlvb39/Pnzu3fvnpmZKYxH9Nprr6W/kaKioldeecXuAQLMo2X5thzc0M2bNzs6Oh67/emdXbt2pX8CqXywefPm8vLy9CseHAHbFUGAeeTk5kTEzc3N8/Pzd74eGRmprq5eWFhY7aNbt27dxx9/nM4WSkpKtm7dakVCEGDIiuHh4XPnzv39O/39/fv27SuAs098+OGHr776aspX//TTT19++WV7CAgwZEVra2skErnnmxcvXqyrq4vH46v6oZWVlX399dcbN25M4bpvv/32F198YfcAAYasuH79etDa+/5Td3d30ODcvAidPevXr//xxx9feOGFpK713nvvfffdd0VFRfYQEGDIvEQi0dTU9ICP/3Z0dNTX16/2hxk0+KefftqyZctKXs0tLy//9ttvv//+++Do2R4CK+E8NZC03tsefJm2trYgRV999dWqfqRPPPFE0NR33333zJkzV65cue/bvINOv/HGG++8886GDRvsGyDAkC3RaLSxsXEll2xoaAga/Nlnn632h/zybVNTU+Pj4zdu3Lh169by8nJRUdG6deuef/75jRs3Bl/YMUCAIbsuXLgwNDS0wgv/8ccfpaWlH330UQE88P+67c0337z78rblFiAdXgOGJITD4ZaWlqSucvDgwc7OzkIawpr/ZX8AAYYcOX36dLKn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";

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
     })
      .done()
      this.props.navigator.replace({
        title: "Inventory",
        component: StoreHome,
        rightButtonIcon: require('image!blueetooth'),
        passProps: {StoreID: this.state.storeID}
        });
    }
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