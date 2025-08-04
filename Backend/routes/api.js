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

module.exports = router;
