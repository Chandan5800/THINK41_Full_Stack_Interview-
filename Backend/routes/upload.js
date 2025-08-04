const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const router = express.Router();
const db = require('../db');

// USERS
router.get('/load-users', (req, res) => {
    const results = [];

    fs.createReadStream(path.join(__dirname, 'users.csv'))
        .pipe(csv())
        .on('data', (row) => {
            try {
                row.id = parseInt(row.id);
                row.age = parseInt(row.age);
                row.latitude = parseFloat(row.latitude);
                row.longitude = parseFloat(row.longitude);
                row.created_at = new Date(row.created_at.replace('+00:00', ''));
                results.push(row);
            } catch (e) {
                console.error('❌ Data error:', e);
            }
        })
        .on('end', () => {
            if (results.length === 0) return res.send('❌ No users found in CSV');

            let completed = 0;
            results.forEach(user => {
                db.query('INSERT INTO users SET ?', user, (err, result) => {
                    completed++;
                    if (err) console.error('❌ Insert error:', err.sqlMessage);
                    if (completed === results.length) {
                        console.log('✅ All users inserted');
                        res.send('✅ Users import complete');
                    }
                });
            });
        });
});

// ORDERS
router.get('/load-orders', (req, res) => {
    const results = [];

    fs.createReadStream(path.join(__dirname, 'orders.csv'))
        .pipe(csv())
        .on('data', (row) => {
            try {
                // Log each row for debug
                console.log('Parsed order row:', row);

                row.order_id = parseInt(row.order_id);
                row.user_id = parseInt(row.user_id);
                row.num_of_item = parseInt(row.num_of_item);
                row.created_at = row.created_at ? new Date(row.created_at.replace('+00:00', '')) : null;
                row.returned_at = row.returned_at ? new Date(row.returned_at.replace('+00:00', '')) : null;
                row.shipped_at = row.shipped_at ? new Date(row.shipped_at.replace('+00:00', '')) : null;
                row.delivered_at = row.delivered_at ? new Date(row.delivered_at.replace('+00:00', '')) : null;

                results.push(row);
            } catch (e) {
                console.error('❌ Failed to parse order:', e);
            }
        })
        .on('end', () => {
            if (results.length === 0) return res.send('❌ No orders found or failed to parse');

            let completed = 0;
            results.forEach(order => {
                db.query('INSERT INTO orders SET ?', order, (err) => {
                    completed++;
                    if (err) {
                        console.error(`❌ Order ID ${order.order_id} insert failed:`, err.sqlMessage);
                    } else {
                        console.log(`✅ Inserted order ID: ${order.order_id}`);
                    }
                    if (completed === results.length) {
                        res.send('✅ Orders import complete');
                    }
                });
            });
        });
});


module.exports = router;
