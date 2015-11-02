
						<View style={styles.container}>

			<View style={styles.separator}/>

			<View style={styles.buttonContainer}>

			<TouchableHighlight style={styles.touchableHighlight} underlayColor="#99AA99"onPress={this.onStopPress}> <View style={[styles.buttonBox, styles.loadButtonBox]}>
			<Text style={styles.buttonText}>
			Stop
			</Text>
			</View>
			</TouchableHighlight>

			<TouchableHighlight {styles.touchableHighlight} underlayColor="#AA9999" onPress={this.onStartPress}>
			<View style={[styles.buttonBox, styles.saveButtonBox]}>
			<Text style={styles.buttonText}>
			Start
			</Text>
			</View>
			</TouchableHighlight>

			<TouchableHighlight {styles.touchableHighlight} underlayColor="#AA9999" onPress={this.onSetPress}>
			<View style={[styles.buttonBox, styles.setButtonBox]}>
			<Text style={styles.buttonText}>
			Set
			</Text>
			</View>
			</TouchableHighlight>

			<TouchableHighlight {styles.touchableHighlight} underlayColor="#AA9999" onPress={this.onStartScanningPress}>
			<View style={[styles.buttonBox, styles.setButtonBox]}>
			<Text style={styles.buttonText}>
			Start
			</Text>
			</View>
			</TouchableHighlight>

			<TouchableHighlight {styles.touchableHighlight} underlayColor="#AA9999" onPress={this.onStopScanningPress}>
			<View style={[styles.buttonBox, styles.setButtonBox]}>
			<Text style={styles.buttonText}>
			Stop
			</Text>
			</View>
			</TouchableHighlight>

			<TouchableHighlight {styles.touchableHighlight} underlayColor="#AA9999" onPress={this.test}>
			<View style={[styles.buttonBox, styles.setButtonBox]}>
			<Text style={styles.buttonText}>
			Test
			</Text>
			</View>
			</TouchableHighlight>

			</View>
			</View>
			);


	container: {
		flex            : 1,
	},
	instructionsText : {
		fontSize : 20
	},
	separator : {
		borderWidth  : .5,
		borderColor  : '#AEAEAE',
		height       : 1,
		width        : 300,
		marginBottom : 25
	},
	labelContainer : {
		flexDirection  : 'row',
		width          : 300
	},
	labelText : {
		paddingRight : 10,
		fontSize     : 18
	},
	textInput : {
		height      : 26,
		borderWidth : 0.5,
		borderColor : '#0f0f0f',
		padding     : 4,
		flex        : 1,
		fontSize    : 13,
	},
	buttonContainer : {
		flexDirection  : 'row',
		justifyContent : 'center',
		alignItems     : 'center',
		marginTop      : 20
	},
	touchableHighlight : {
		marginLeft  : 10,
		marginRight : 10,
	},
	buttonBox : {
		flexDirection  : 'row',
		justifyContent : 'center',
		alignItems     : 'center',
		padding        : 10,
		borderWidth    : 2,
		borderRadius   : 5
	},
	saveButtonBox : {
		borderColor : '#AA0000'
	},
	loadButtonBox : {
		borderColor : '#00AA00'
	},
	setButtonBox : {
		borderColor : '#00AA00'
	},
	outputContainer : {
		width          : 300,
		height         : 200,
		justifyContent : 'center',
		alignItems     : 'center',
		borderWidth    : .5,
		borderColor    : "#999999",
		marginTop      : 20
	}, 
	row: {
		padding: 8,
		paddingBottom: 16
	}, 
	smallText: {
		fontSize: 11
	},
	formInput: {
		flex: 1,
		height: 26,
		fontSize: 13,
		borderWidth: 1,
		borderColor: "#555555",
	},
	saved: {
		fontSize: 20,
		textAlign: "center",
		margin: 10,
	},