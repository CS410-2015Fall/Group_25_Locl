'use strict';

var React = require('react-native');
var StoreHome = require('./StoreHome');
var CustomerHome = require('./CustomerHome');
var Tutorial = require('./Tutorial');
var Storage = require('react-native-store');

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
	AsyncStorage
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

var Locl = React.createClass({
	getInitialState() {
		return {
			loading: false,
			tutorialCompleted: 'false',
		}
	},

	componentDidMount() {
		this.loadTutorialStatus().done();
	},

	async loadTutorialStatus() {
		try {
			var tutorialCompleted = await AsyncStorage.getItem('tutorialCompleted');
			if (tutorialCompleted !== null){
				this.setState({
					tutorialCompleted: tutorialCompleted,
					loading: true,
				});
				console.log("Tutorial completed");
			} else {
				console.log("Intro not completed");
				this.setState({
					loading: true,
				})
			}
		} catch (error) {
			console.log("Async error: " + error.message);
		}
	},

	renderLoadingView: function() {
		return (
			<View style={styles.container}>
			<Text>
			Loading a Locl Experience..
			</Text>
			</View>
			);
	},

	render() {
		if (this.state.loading === false) {
			return (
				this.renderLoadingView()
				);
		}
		else {
			if(this.state.tutorialCompleted === 'false') {
				return (
					<NavigatorIOS ref='nav'
					style={styles.container}
					navigationBarHidden={true}
					initialRoute={{
						component: Tutorial,
					}}/>
					);
			} else {
				return (
					<NavigatorIOS ref='nav'
					style={styles.container}
					navigationBarHidden={false}
					initialRoute={{
						title: "Home",
						component: CustomerHome,
					}}/>
					);
			}

		}
	},
});

AppRegistry.registerComponent('Locl', () => Locl);
