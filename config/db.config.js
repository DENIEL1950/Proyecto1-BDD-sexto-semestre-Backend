const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // ajusta según tu configuración
  password: '1234', // ajusta según tu configuración
  database: 'tiendalinea', // ajusta al nombre de tu base de datos
  port: 3306
});

connection.connect(error => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = connection;