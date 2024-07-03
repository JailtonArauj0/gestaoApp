import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { openDatabase, registerUser, deleteDatabase } from '../database/database.js';

const db = openDatabase();

//const deleteDb = deleteDatabase();

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');

    const handleRegister = async () => {
        try {
            const isRegistered = await registerUser(db, email, password, role);
            if (isRegistered) {
                Alert.alert('Registro bem-sucedido!', 'Usuário registrado com sucesso.');
                setEmail('');
                setPassword('');
                navigation.navigate('Login');
            } else {
                Alert.alert('Falha no registro', 'Erro ao registrar o usuário.');
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            Alert.alert('Erro ao registrar', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/gestao-logo.png')} style={styles.logo} />
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Senha:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry
            />
            <Text style={styles.label}>Tipo de Conta:</Text>
            <Picker
                selectedValue={role}
                style={styles.input}
                onValueChange={(itemValue) => setRole(itemValue)}
            >
                <Picker.Item label="Aluno" value="student" />
                <Picker.Item label="Professor" value="teacher" />
            </Picker>
            <Button title="Registrar" onPress={handleRegister} />
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

export default RegisterScreen;
