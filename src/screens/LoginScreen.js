import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { openDatabase, createUserTable, registerUser, findUserByEmailAndPassword } from '../database/database.js';
import { useNavigation } from '@react-navigation/native';

const db = openDatabase();
createUserTable(db);

const LoginScreen = () => {
	const navigation = useNavigation()
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		try {
			if (!email || !password) {
				Alert.alert('Erro', 'Por favor, preencha todos os campos.');
				return;
			}
			const user = await findUserByEmailAndPassword(db, email, password);
			if (user) {
				Alert.alert('Logado', `Bem-vindo ${user.email}`);
				if (user.role === 'teacher') {
					navigation.navigate('Inserir notas');
				} else if (user.role === 'student') {
					navigation.navigate('Notas', { studentId: user.id });
				}
			} else {
				Alert.alert('Erro', 'Email ou senha inválidos');
			}
		} catch (error) {
			Alert.alert('Erro ao realizar login', error.message);
		}
	};

	const handleRegister = () => {
		navigation.navigate('Registrar');
	};

	return (
		<View style={styles.container}>
			<Image source={require('../assets/gestao-logo.png')} style={styles.logo} />
			<Text style={styles.title}>Entrar</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
				placeholderTextColor="#000"
			/>
			<TextInput
				style={styles.input}
				placeholder="Senha"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				placeholderTextColor="#000"
			/>
			<TouchableOpacity style={styles.button} onPress={handleLogin}>
				<Text style={styles.buttonText}>Entrar</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registrar')}>
				<Text style={styles.buttonText}>Cadastre-se</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#869ca3',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		width: '80%',
		height: 40,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 10,
		backgroundColor: '#fff'
	},
	button: {
		width: '80%',
		height: 40,
		backgroundColor: '#007BFF',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		marginVertical: 5,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	logo: {
		width: 100,
		height: 100,
		marginBottom: 20,
	},
});

export default LoginScreen;