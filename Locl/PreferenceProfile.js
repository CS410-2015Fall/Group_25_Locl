var React = require('react-native');
var CustomerHome = require('./CustomerHome.js');

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
  PixelRatio
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '8173c7',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  textFieldTitle: {
    marginBottom: 2, 
    fontSize: 20,
    color: '#F5F5F5'
  },
  buttonText: {
   color: '#F5F5F5',
   fontSize: 18,
   alignSelf: 'center'
  },
  buttonBox: {
    borderColor : '#F5F5F5',
    justifyContent : 'center',
    alignItems     : 'center',
    padding  : 10,
    borderWidth    : 2,
    borderRadius   : 5,
    margin: 20
  }, 
  preferenceBox: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonWithField: {
   borderColor : '#F5F5F5',
   padding  : 10,
   borderWidth    : 2,
   borderRadius   : 5,
   marginLeft: 5,
   marginRight: 10
  },
  fieldWithButton: {
    flex: 2,
    height: 40, 
    marginLeft: 10, 
    marginRight: 5,  
    borderColor: 'F5F5F5', 
    backgroundColor: "white",
    borderWidth: 1,
    paddingLeft: 2,
  },
  rowContainer: {
    borderColor: 'white',
    borderWidth: 1, 
    backgroundColor: 'F5F5F5',
    flexDirection: 'row',
    padding: 10,
    margin: 5, 
  }, 
  textContainer: {
    flex: 1
  },


});

var PreferenceProfile = React.createClass({
  render() {
    this.getPreferences(this.props.CustomerID);
    return (
      <View style={styles.container}>
      <Text style={styles.textFieldTitle}> Add Favourite Items </Text>

      <View style={styles.preferenceBox}>

      <TextInput
      style={styles.fieldWithButton}
      onChangeText={(text) => this.setState({preferenceTextField: text})}
      value={this.state.preferenceTextField}
      />

      <TouchableHighlight style={styles.buttonWithField} onPress={this.onCreatePress}>
      <Text style={styles.buttonText}>Add</Text>
      </TouchableHighlight>
      
      </View>

      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderPreference}
      />

      </View>
      );
  },

  getInitialState: function() {
    console.log("CustomerID passed to PreferenceProfile: " + this.props.CustomerID);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      minors: [], 
      customerID: this.props.CustomerID,
      preferenceTextField: '',
    } 
  },

  componentWillMount: function() {
    this.getPreferences(this.props.CustomerID); 
  },

  renderPreference: function(preference) {
    return (
      <TouchableHighlight underlayColor="#AA9999" onPress={() => this.onDeletePress(preference.ItemID)}> 
      <View>
      <View style={styles.rowContainer}>
      <View  style={styles.textContainer}>
      <Text style={styles.title} 
      numberOfLines={1}>{preference.ItemName}</Text>
      </View>
      </View>
      <View style={styles.separator}/>
      </View>
      </TouchableHighlight>
      );
  },

  onCreatePress: function() {
    if (this.state.preferenceTextField.length == 0) {
      AlertIOS.alert("Cannot add a blank preference!");
    } else {
      fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer-items?app_name=loclSQL", {method: "POST", body: JSON.stringify({CustID: this.props.CustomerID, ItemName: this.state.preferenceTextField})})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Preference created: " + this.state.preferenceTextField);
      })
      .done();
    }
  },

  onDeletePress: function(itemID) {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer-items?app_name=loclSQL&filter=CustID%20%3D" + this.props.CustomerID + "%20and%20itemID%20%3D%20%22" + itemID + "%22", {method: "DELETE"})
    .then((response) => response.json())
    .then((responseData) => {    
      console.log("Deleted Customer Item: " + itemID);
    })
    .done();
  },

  getPreferences: function() {
    fetch("http://ec2-54-187-51-38.us-west-2.compute.amazonaws.com/rest/db/customer-items?app_name=loclSQL&filter=CustID=" + this.props.CustomerID, {method: "GET"})
    .then((response) => response.json())
    .then((responseData) => {    
     if (responseData.error) {
      console.log("Get Preferences Error: " + responseData.error);
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

});

module.exports = PreferenceProfile;