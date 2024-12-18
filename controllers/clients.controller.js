const connection = require('../config/db.config');

const clientsController = {
  getClientById: (req, res) => {
    const id = req.params.id;
    
    // Primero obtenemos los datos del cliente
    const clientQuery = `
      SELECT 
        customer_id,
        first_name,
        last_name,
        address,
        email,
        phone_number
      FROM customers 
      WHERE customer_id = ?`;

    connection.query(clientQuery, [id], (error, clientResults) => {
      if (error) {
        console.error('Error al obtener el cliente:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (clientResults.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const customer = clientResults[0];

      // Consulta modificada para obtener productos usando la tabla customer_products
      const productsQuery = `
        SELECT 
          p.product_id,
          p.product_name,
          p.category,
          p.price
        FROM products p
        INNER JOIN customer_products cp ON p.product_id = cp.product_id
        WHERE cp.customer_id = ?
        ORDER BY p.product_name`;

      connection.query(productsQuery, [id], (productError, productResults) => {
        if (productError) {
          console.error('Error al obtener los productos:', productError);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }

        // Combinamos los datos del cliente con sus productos
        const customerData = {
          customer_id: customer.customer_id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          address: customer.address,
          email: customer.email,
          phone_number: customer.phone_number,
          products: productResults
        };
        
        console.log('Datos enviados al cliente:', customerData); // Para depuración
        res.json(customerData);
      });
    });
  },

  getAllClients: (req, res) => {
    const query = `
      SELECT 
        customer_id,
        first_name,
        last_name,
        email
      FROM customers
      ORDER BY first_name, last_name`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error al obtener los clientes:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      
      // Formatear los datos de los clientes
      const customers = results.map(customer => ({
        id: customer.customer_id,
        nombre_completo: `${customer.first_name} ${customer.last_name}`,
        correo: customer.email
      }));
      
      res.json(customers);
    });
  },

  searchClients: (req, res) => {
    const { search } = req.query;
    
    const query = `
      SELECT 
        customer_id,
        first_name,
        last_name,
        email
      FROM customers
      WHERE email LIKE ?
      ORDER BY first_name, last_name`;

    const searchPattern = `%${search}%`;
    
    connection.query(query, [searchPattern], (error, results) => {
      if (error) {
        console.error('Error al buscar clientes:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      
      const customers = results.map(customer => ({
        id: customer.customer_id,
        nombre_completo: `${customer.first_name} ${customer.last_name}`,
        correo: customer.email
      }));
      
      res.json(customers);
    });
  }
};

module.exports = clientsController; 