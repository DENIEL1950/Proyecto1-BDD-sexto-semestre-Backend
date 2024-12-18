const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients.controller');

router.get('/:id', clientsController.getClientById);
router.get('/search', clientsController.searchClients);
router.get('/', clientsController.getAllClients);

module.exports = router; 