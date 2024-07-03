import SQLite from 'react-native-sqlite-storage';

const deleteDatabase = () => {
    SQLite.deleteDatabase(
        {
            name: 'users.db',
            location: 'default',
        },
        () => {
            console.log('Banco de dados deletado com sucesso');
        },
        error => {
            console.error('Erro ao deletar banco de dados:', error);
        }
    );
};

const openDatabase = () => {
    const db = SQLite.openDatabase(
        {
            name: 'users.db',
            location: 'default',
        },
        () => { },
        error => {
            console.error('Error opening database:', error);
        }
    );
    return db;
};

const createUserTable = db => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, role TEXT)'
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS grades (id INTEGER PRIMARY KEY AUTOINCREMENT, studentId INTEGER, subject TEXT, grade TEXT, FOREIGN KEY (studentId) REFERENCES users(id))'
        );
    });
};

const registerUser = (db, email, password, role) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [email, password, role],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const findUserByEmailAndPassword = (db, email, password) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1',
                [email, password],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        resolve(rows.item(0));
                    } else {
                        resolve(null);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const updateUserPassword = (db, id, newPassword) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE users SET password = ? WHERE id = ?',
                [newPassword, id],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const deleteUser = (db, id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM users WHERE id = ?',
                [id],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const addGrade = (studentId, subject, grade) => {
    const db = openDatabase();

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO grades (studentId, subject, grade) VALUES (?, ?, ?)',
                [studentId, subject, grade],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const getGradesByUserId = (db, studentId) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM grades WHERE studentId = ?',
                [studentId],
                (_, { rows }) => {
                    let grades = [];
                    for (let i = 0; i < rows.length; i++) {
                        console.log(rows.item(i));
                        grades.push(rows.item(i));
                    }
                    resolve(grades);
                },
                (_, error) => {
                    reject(new Error('Erro ao executar SQL: ' + JSON.stringify(error)));
                }
            );
        });
    });
};

export {
    openDatabase,
    createUserTable,
    registerUser,
    findUserByEmailAndPassword,
    updateUserPassword,
    deleteUser,
    addGrade,
    deleteDatabase,
    getGradesByUserId
};
