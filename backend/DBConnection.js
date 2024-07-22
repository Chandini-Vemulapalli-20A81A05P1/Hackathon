import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'M1racle@123',
    database: 'itgdb'
});

export default connection;
