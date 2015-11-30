"use strict";

var React = require("react-native");
var Camera = require("react-native-camera");

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AlertIOS,
} = React;

var barcodeCamera = React.createClass({

    getInitialState: function() {
        return {
            showCamera: true,
            cameraType: Camera.constants.Type.back,
        }
    },

    render: function() {
        if (this.state.showCamera) {
            return (
            <Camera
            ref="cam"
            style={styles.container}
            onBarCodeRead={this._onBarCodeRead}
            type={this.state.cameraType}>
            </Camera>
            );
        } else {
            return (
                <View></View>
                );
        }
        
    },

    _onBarCodeRead: function(e) {
        console.log("Barcode found: " + e.data);
        this.setState({showCamera: false, barcode: e.data});
        this.props.route.callback(e.data);
        this.props.navigator.pop();
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    }
});

module.exports = barcodeCamera;