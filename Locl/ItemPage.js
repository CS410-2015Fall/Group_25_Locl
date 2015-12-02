var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var {
  AlertIOS,
  ScrollView, 
  StyleSheet,
  Text,
  TextInput,
  View,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  NavigatorIOS,
  AppRegistry
} = React;

var styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#8173c7",
},
buttonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
},
upcBox: {
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'space-around',
},
textField: {
  height: 40, 
  marginBottom: 5, 
  marginLeft: 5, 
  marginRight: 5,  
  borderColor: 'F5F5F5', 
  borderWidth: 1,
  paddingLeft: 2, 
  backgroundColor: 'white',
},
textFieldTitle: {
  margin: 5, 
  fontSize: 20,
  color: '#F5F5F5',
  alignSelf: 'center'
},
buttonText: {
   color: '#F5F5F5',
   fontSize: 18,
   alignSelf: 'center'
 },
 buttonBox : {
   borderColor : '#F5F5F5',
   justifyContent : 'center',
   alignItems     : 'center',
   padding  : 10,
   borderWidth    : 2,
   borderRadius   : 5,
   margin: 20
 }, 
thumb: {
  width: 200,
  height: 200,
  alignSelf: 'center',
  borderWidth    : 2,
  borderColor: "#F5F5F5",
  margin: 10
},

buttonWithField: {
   borderColor : '#F5F5F5',
   padding  : 10,
   borderWidth    : 2,
   borderRadius   : 5,
   marginRight: 5
},

fieldWithButton: {
  flex: 2,
  height: 40, 
  marginLeft: 5, 
  marginRight: 5,  
  borderColor: 'F5F5F5', 
  backgroundColor: "white",
  borderWidth: 1,
  paddingLeft: 2,
},

cameraContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    }

});

var ItemPage = React.createClass({
  render: function() {
    var bottom; 
    if (this.state.updateItem) {
      bottom = 
      <View style={styles.buttonContainer}>
      <TouchableHighlight style={styles.buttonBox} onPress={this.onUpdatePress}>
      <Text style={styles.buttonText}> Update </Text>
      </TouchableHighlight>

      <TouchableHighlight style={styles.buttonBox} onPress={this.onDeletePress}>
      <Text style={styles.buttonText}>Delete</Text>
      </TouchableHighlight>
      </View>;
    } else { 
      bottom = 
      <View style={styles.container}>

      <TouchableHighlight style={styles.buttonBox} onPress={this.onAddPress}>
      <Text style={styles.buttonText}>Add</Text>
      </TouchableHighlight>

      </View>;
    }
    return (
      <ScrollView style={styles.container}>
      
      <TouchableHighlight onPress={this.onCameraPress}>
      <Image source={{uri: this.state.htmlLink}} style={styles.thumb}/>
      </TouchableHighlight>

      <Text style={styles.textFieldTitle}>Name</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({name: text})}
      value={this.state.name}
      />

      <Text style={styles.textFieldTitle}>UPC</Text>
      <View style={styles.upcBox}>
      <TextInput
      style={styles.fieldWithButton}
      onChangeText={(text) => this.setState({upc: text})}
      value={this.state.upc}
      />

      <TouchableHighlight style={styles.buttonWithField} onPress={this.getItemDetailsByUPC}>
      <Text style={styles.buttonText}>Check</Text>
      </TouchableHighlight>

      <TouchableHighlight style={styles.buttonWithField} onPress={this.onBarcodeCameraPress}>
      <Text style={styles.buttonText}>Camera</Text>
      </TouchableHighlight>
      
      </View>

      <Text style={styles.textFieldTitle}>Quantity</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({quantity: text})}
      value={this.state.quantity}
      />

      <Text style={styles.textFieldTitle}>Regular Price</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({regPrice: text})}
      value={this.state.regPrice}
      />

      <Text style={styles.textFieldTitle}>Sale Price</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({salePrice: text})}
      value={this.state.salePrice}
      />

      <Text style={styles.textFieldTitle}>Description</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({description: text})}
      value={this.state.description}
      />

      <Text style={styles.textFieldTitle}>Start Date</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({startDate: text})}
      value={this.state.startDate}
      />

      <Text style={styles.textFieldTitle}>End Date</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({endDate: text})}
      value={this.state.endDate}
      />

      {bottom}
      
      </ScrollView>
      );
},

getInitialState: function() {
  console.log("StoreID passed to AddItem: " + this.props.StoreID);
  if (this.props.ItemData) {
    return {
      updateItem: true,
      name: this.props.ItemData.Name,
      upc: this.props.ItemData.UPC.toString(),
      quantity: this.props.ItemData.Quantity.toString(),
      regPrice: this.props.ItemData.RegPrice.toString(),
      salePrice: this.props.ItemData.SalePrice.toString(),
      description: this.props.ItemData.Description,
      startDate: this.props.ItemData.StartDate,
      endDate: this.props.ItemData.EndDate,
      htmlLink: this.props.ItemData.HTMLlink,
      storeID: this.props.StoreID,
    }
  } else {
    return {
      name: "",
      upc: "",
      quantity: "",
      regPrice: "",
      salePrice: "",
      description: "",
      startDate: "",
      endDate: "",
      htmlLink: "http://www.indre-reisid.ee/wp-content/themes/envision/lib/images/default-placeholder.png",
      storeID: this.props.StoreID,
    }
  }
},

getItemDetailsByUPC: function(upc) {
  if ((this.state.upc.length >= 12) && (this.state.upc.match(/^\d+$/))) {
    fetch("http://www.searchupc.com/handlers/upcsearch.ashx?request_type=3&access_token=98A88ED2-16F7-476B-BCCF-92B44912AAF5&upc=" + this.state.upc, {method: "GET"})
        .then((response) => {
          var parse = JSON.parse(response._bodyText);
          if (response.error) {
            console.log("Get Details by UPC Error: " + response.error);
          } else {
            this.setState({
              name: parse[0].productname,
              regPrice: parse[0].price,
              htmlLink: parse[0].imageurl,
            })
          }}).done(); 
    }
},

onUpdatePress: function()  {
  if(this.state.name == "" || this.state.startDate == "" || this.state.endDate == "" || this.state.quantity == "" || this.state.regPrice == "" || this.state.salePrice == "") {
    AlertIOS.alert("Required fields missing");
  } else {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL&filter=ItemID=" + this.props.ItemData.ItemID, 
      {method: "Put", body: JSON.stringify({
        Quantity: this.state.quantity, 
        Name: this.state.name, 
        UPC: this.state.upc, 
        RegPrice: this.state.regularPrice, 
        SalePrice: this.state.salePrice, 
        StartDate: this.state.startDate, 
        EndDate: this.state.endDate, 
        HTMLlink: this.state.htmlLink, 
        Description: this.state.description
      })})
    .then((responseData) => {
     AlertIOS.alert("Item Updated");
   })
    .done()
    var StoreHome = require('./StoreHome.js');
    this.props.navigator.pop({
      component: StoreHome,
      passProps: {StoreID: this.props.StoreID,}
    });
  }
},

onBarcodeCameraPress: function() {
  var barcodeCamera = require('./barcodeCamera.js');
  this.props.navigator.push({
      title: "Scan a barcode",
      component: barcodeCamera,
      callback: this.callbackBarcode,
      leftButtonTitle: 'Back',
      onLeftButtonPress: () => {
        this.props.navigator.pop();
      }
    });
},

callbackBarcode: function(barcode) {
  console.log("UPC set to: " + barcode);
  this.setState({
        upc: barcode,
      });
  this.getItemDetailsByUPC();
},

onAddPress: function() {
  if(this.state.name == "" || this.state.startDate == "" || this.state.endDate == "" || this.state.quantity == "" || this.state.regPrice == "" || this.state.salePrice == "") {
    AlertIOS.alert("Required fields missing");
  } else {
    console.log("Creating item with StoreID: " + this.state.storeID + " htmllink: " + this.state.htmlLink);
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL", 
      {method: "POST", body: JSON.stringify(
        {Name: this.state.name, 
          Description: this.state.description, 
          StartDate: this.state.startDate, 
          EndDate: this.state.endDate, 
          Quantity: this.state.quantity,  
          RegPrice: this.state.regPrice, 
          SalePrice: this.state.salePrice, 
          UPC: this.state.upc, 
          StoreID: this.state.storeID, 
          HTMLlink: this.state.htmlLink})})
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Item Create Response: " + responseData.ItemID);
      AlertIOS.alert("Item Added");
   })
    .done()
    var StoreHome = require('./StoreHome.js');
    this.props.navigator.pop({
      component: StoreHome,
      passProps: {StoreID: this.props.StoreID,}
    });
  }
},

onDeletePress: function() {
  fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL&filter=ItemID="+this.props.ItemData.ItemID, {method: "DELETE"})
  .then((response) => response.json())
  .then((responseData) => {    
    AlertIOS.alert("Item Deleted");
  })
  .done();
  var StoreHome = require('./StoreHome.js');
  this.props.navigator.pop({
      component: StoreHome,
      passProps: {StoreID: this.props.StoreID,}
    });
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
      console.log('Image picker cancelled');
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

module.exports = ItemPage;