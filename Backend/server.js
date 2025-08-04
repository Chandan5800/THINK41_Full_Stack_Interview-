const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');

app.use('/api', uploadRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
