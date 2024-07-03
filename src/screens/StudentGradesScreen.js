import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { openDatabase, getGradesByUserId } from '../database/database.js';

const db = openDatabase();

const StudentGradesScreen = ({ route }) => {
	const { studentId } = route.params;
	const [grades, setGrades] = useState([]);

	useEffect(() => {
		const fetchGrades = async () => {
			try {
				const grades = await getGradesByUserId(db, studentId);
				setGrades(grades);
			} catch (error) {
				console.error('Erro ao buscar notas:', error);
			}
		};

		fetchGrades();
	}, [studentId]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Suas Notas</Text>
			<FlatList
				data={grades}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.gradeItem}>
						<Text style={styles.subject}>{item.subject}</Text>
						<Text style={styles.grade}>{item.grade}</Text>
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#869ca3',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		width: 100,
		height: 100,
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
		color: '#fff',
	},
	gradeItem: {
		width: '100%',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		backgroundColor: '#fff',
		marginBottom: 10,
		borderRadius: 5,
	},
	subject: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
	},
	grade: {
		fontSize: 16,
		color: '#555',
	},
});

export default StudentGradesScreen;
