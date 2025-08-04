const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/customers', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
    SELECT u.*, COUNT(o.order_id) AS order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY u.id
    LIMIT ? OFFSET ?
  `;

    db.query(query, [limit, offset], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        res.json({ page, limit, customers: results });
    });
});


router.get('/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const query = `
    SELECT u.*, COUNT(o.order_id) AS order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `;

    db.query(query, [customerId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(results[0]);
    });
});


// BUILD ORDER API

router.get('/customers/:id/orders', (req, res) => {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID' });
    }

    db.query('SELECT * FROM users WHERE id = ?', [customerId], (err, users) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        if (users.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        db.query('SELECT * FROM orders WHERE user_id = ?', [customerId], (err, orders) => {
            if (err) return res.status(500).json({ error: 'Database error', details: err });
            res.json({ customer_id: customerId, total_orders: orders.length, orders });
        });
    });
});

// BUILD SPECIFIC ORDER API

router.get('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    const query = `
    SELECT o.*, u.first_name, u.last_name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.order_id = ?
  `;

    db.query(query, [orderId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(results[0]);
    });
});



module.exports = router;
