const connection = require('../config/db.config');

const productsController = {
  // Obtener todos los productos
  getAllProducts: (req, res) => {
    connection.query('SELECT * FROM productos', (error, results) => {
      if (error) {
        console.error('Error al obtener productos:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      res.json(results);
    });
  },

  // Obtener un producto por ID
  getProductById: (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM productos WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error al obtener el producto:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(results[0]);
    });
  },

  // Crear un nuevo producto
  createProduct: (req, res) => {
    const { nombre, precio, descripcion, imagen } = req.body;
    connection.query(
      'INSERT INTO productos (nombre, precio, descripcion, imagen) VALUES (?, ?, ?, ?)',
      [nombre, precio, descripcion, imagen],
      (error, results) => {
        if (error) {
          console.error('Error al crear el producto:', error);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.status(201).json({ id: results.insertId, message: 'Producto creado exitosamente' });
      }
    );
  },

  // Actualizar un producto
  updateProduct: (req, res) => {
    const id = req.params.id;
    const { nombre, precio, descripcion, imagen } = req.body;
    connection.query(
      'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ? WHERE id = ?',
      [nombre, precio, descripcion, imagen, id],
      (error, results) => {
        if (error) {
          console.error('Error al actualizar el producto:', error);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
      }
    );
  },

  // Eliminar un producto
  deleteProduct: (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM productos WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error al eliminar el producto:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto eliminado exitosamente' });
    });
  }
};

module.exports = productsController; 