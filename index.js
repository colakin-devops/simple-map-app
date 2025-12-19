const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import your proxy logic
const mapHandler = require('./api/map');

// Root route to test deployment
app.get('/', (req, res) => {
  res.send('✅ Server is running! Use /api/map to view the map.');
});

// Proxy route
app.get('/api/map', mapHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
