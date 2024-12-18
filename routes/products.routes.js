const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

// Obtener todos los productos
router.get('/products', productsController.getAllProducts);

// Obtener un producto por ID
router.get('/products/:id', productsController.getProductById);

// Crear un nuevo producto
router.post('/products', productsController.createProduct);

// Actualizar un producto
router.put('/products/:id', productsController.updateProduct);

// Eliminar un producto
router.delete('/products/:id', productsController.deleteProduct);

module.exports = router; 