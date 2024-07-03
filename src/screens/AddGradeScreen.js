import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { openDatabase, addGrade } from '../database/database';

const AddGradeScreen = () => {
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState('');
	const [subject, setSubject] = useState('');
	const [grade, setGrade] = useState('');

	useEffect(() => {
		const db = openDatabase();
		db.transaction(tx => {
			tx.executeSql(
				'SELECT * FROM users WHERE role = ?',
				['student'],
				(_, { rows }) => {
					const studentsArray = [];
					for (let i = 0; i < rows.length; i++) {
						studentsArray.push(rows.item(i));
					}
					setStudents(studentsArray);
				},
				(_, error) => {
					console.error('Error fetching students:', error);
				}
			);
		});
	}, []);

	const handleAddGrade = async () => {
		if (selectedStudent && subject && grade) {
			try {
				const isAdded = await addGrade(selectedStudent, subject, grade);
				if (isAdded) {
					Alert.alert('Nota Adicionada', 'Nota adicionada com sucesso.');
					setSubject('');
					setGrade('');
				} else {
					Alert.alert('Erro', 'Falha ao adicionar nota.');
				}
			} catch (error) {
				Alert.alert('Erro ao adicionar nota', error.message);
			}
		} else {
			Alert.alert('Erro', 'Preencha todos os campos.');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Adicionar notas</Text>
			<Text style={styles.label}>Selecione um Aluno:</Text>
			<Picker
				selectedValue={selectedStudent}
				style={styles.input}
				onValueChange={(itemValue) => setSelectedStudent(itemValue)}
			>
				{students.map((student) => (
					<Picker.Item key={student.id} label={student.email} value={student.id} />
				))}
			</Picker>
			<Text style={styles.label}>Matéria:</Text>
			<TextInput
				style={styles.input}
				value={subject}
				onChangeText={setSubject}
				placeholder="Digite a matéria"
			/>
			<Text style={styles.label}>Nota:</Text>
			<TextInput
				style={styles.input}
				value={grade}
				onChangeText={setGrade}
				placeholder="Digite a nota"
			/>
			<Button title="Adicionar Nota" onPress={handleAddGrade} />
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
	label: {
		fontSize: 18,
		marginBottom: 5,
		color: '#fff'
	},
	input: {
		width: '80%',
		height: 40,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 10,
		backgroundColor: '#fff',
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
});

export default AddGradeScreen;
