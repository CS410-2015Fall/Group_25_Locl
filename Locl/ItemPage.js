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

var ItemPage = React.createClass({
  render(){
    var top;
    var bottom;
    console.log(this.state.otherSource); 
    if (this.state.updateItem) {
      bottom = 
      <View style={styles.container}>

      <TouchableHighlight onPress={this.onUpdatePress}>
      <Text style={styles.button}>Update</Text>
      </TouchableHighlight>

      <TouchableHighlight onPress={this.onDeletePress}>
      <Text style={styles.button}>Delete</Text>
      </TouchableHighlight>

      </View>;
    } else { 
      bottom = 
      <View style={styles.container}>

      <TouchableHighlight onPress={this.onAddPress}>
      <Text style={styles.button}>Add</Text>
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
      onChangeText={(text) => this.setState({name: text})}
      value={this.state.name}
      />

      <Text style={styles.textFieldTitle}>UPC:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({upc: text})}
      value={this.state.upc}
      />

      <Text style={styles.textFieldTitle}>Quantity:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({quantity: text})}
      value={this.state.quantity}
      />

      <Text style={styles.textFieldTitle}>Regular Price:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({regPrice: text})}
      value={this.state.regPrice}
      />

      <Text style={styles.textFieldTitle}>Sale Price:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({salePrice: text})}
      value={this.state.salePrice}
      />

      <Text style={styles.textFieldTitle}>Description:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({description: text})}
      value={this.state.description}
      />

      <Text style={styles.textFieldTitle}>Start Date:</Text>
      <TextInput
      style={styles.textField}
      onChangeText={(text) => this.setState({startDate: text})}
      value={this.state.startDate}
      />

      <Text style={styles.textFieldTitle}>End Date:</Text>
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
    }
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
    this.props.navigator.pop();
  }
},

onAddPress: function() {
  if(this.state.name == "" || this.state.startDate == "" || this.state.endDate == "" || this.state.quantity == "" || this.state.regPrice == "" || this.state.salePrice == "") {
    AlertIOS.alert("Required fields missing");
  } else {
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
          StoreID:this.props.StoreID, 
          HTMLlink: this.state.htmlLink})})
    .then((response) => response.json())
    .then((responseData) => {
     AlertIOS.alert("Item Added");
   })
    .done()
    this.props.navigator.pop();
  }
},

onDeletePress: function() {
  fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/item?app_name=loclSQL&filter=ItemID="+this.props.ItemData.ItemID, {method: "DELETE"})
  .then((response) => response.json())
  .then((responseData) => {    
    AlertIOS.alert("Item Deleted");
  })
  .done();
  this.props.navigator.pop();
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

module.exports = ItemPage;