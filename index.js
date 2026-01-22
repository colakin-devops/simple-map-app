const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import your proxy logic
const mapHandler = require('./api/map');
const auMapHandler = require('./api/au-map');

// Root route to test deployment
app.get('/', (req, res) => {
  res.send('✅ Server is running! Use /api/map or /api/au-map to view the map.');
});

// Proxy route
app.get('/api/map', mapHandler);
app.get('/api/au-map', auMapHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
