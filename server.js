const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tiendalinea',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

app.get('/api/clients/:id', (req, res) => {
  const id = req.params.id;
  
  console.log('Buscando cliente con ID:', id);

  const sqlQuery = `
    SELECT 
      c.*,
      o.order_id,
      o.order_date,
      o.total_price
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE c.customer_id = ?
  `;

  connection.query(sqlQuery, [id], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(results[0]);
  });
});

app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error en la base de datos' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/clients/search', (req, res) => {
  const { query, type } = req.query;
  
  console.log('Recibida petición de búsqueda:', {
    query: query,
    type: type,
    url: req.url
  });

  // Consulta simplificada
  const sqlQuery = 'SELECT * FROM customers WHERE last_name LIKE ?';
  const searchValue = `%${query}%`;

  console.log('Ejecutando consulta SQL:', {
    query: sqlQuery,
    value: searchValue
  });

  connection.query(sqlQuery, [searchValue], (error, results) => {
    if (error) {
      console.error('Error en la consulta SQL:', error);
      return res.status(500).json({
        error: true,
        message: 'Error en la base de datos',
        details: error.message
      });
    }

    console.log('Resultados de la búsqueda:', {
      count: results.length,
      results: results
    });

    // Enviar resultados incluso si está vacío
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});