const express = require('express');
const app = express();
const cors = require('cors');

const uploadRoutes = require('./routes/upload');
const apiRoutes = require('./routes/api');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', uploadRoutes);
app.use('/api', apiRoutes);


app.listen(3001, () => {
    console.log('🚀 Server running on port 3001');
});
