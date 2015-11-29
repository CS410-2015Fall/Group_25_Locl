'use strict';

var React = require('react-native');
var Preference = require('./Preference');
var StoreHome = require('./StoreHome');
var CustomerHome = require('./CustomerHome');
var Tutorial = require('./Tutorial');
// If true, goes into the setup screen, not a home screen
var introductionCompleted = true;
// If true, goes to store screen, otherwise customer screen
var customer = true;

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
	AppRegistry
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
	}
});

var Locl = React.createClass({
	render() {
		if(introductionCompleted == false){
			return (
				<NavigatorIOS ref='nav'
				style={styles.container}
				initialRoute={{
					title: 'Welcome',
					component: Tutorial,
				}}/>
				);

		} else {
			if(customer){
				return (
					<NavigatorIOS ref='nav'
					style={styles.container}
					initialRoute={{
						title: 'Locl',
						component: CustomerHome,
					}}/>
					);


			} else {
				return (
					<NavigatorIOS ref='nav'
					style={styles.container}
					initialRoute={{
						title: 'Store',
						component: StoreHome,
					}}/>
					);
			}
		}
	}
});


AppRegistry.registerComponent('Locl', () => Locl);