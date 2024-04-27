const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// SQL configuration read from environment variables
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Serve HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API endpoint to post orders
app.post('/api/orders', async (req, res) => {
    try {
        await sql.connect(config);
        const { size, topping, customerName, phone, pizzaName, price } = req.body;
        console.log(req.body);
        const result = await sql.query`INSERT INTO tOrders (Size, Toppings, CustomerName, phone,[PizzaName], price ) VALUES (${size}, ${topping}, ${customerName}, ${phone}, ${pizzaName}, ${price})`;
        res.json({ success: true, message: 'Order placed successfully', result });
        console.log(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to place order', error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
