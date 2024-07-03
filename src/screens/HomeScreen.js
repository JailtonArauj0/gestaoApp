import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bem-vindo à Gestão Escolar</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		textAlign: 'center',
	},
});

export default HomeScreen;
