// server.js
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;

// Array to store connected clients
const clients = [];

// Serve static files from the "SSE TESTING" folder
app.use(express.static(path.join(__dirname, 'public')));

console.log(__dirname);

// Route for SSE endpoint
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Add client to the clients array
    clients.push(res);

    // Handle client disconnect
    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
    });
});

// Route to simulate sending a message
app.get('/send-message', (req, res) => {
    const message = req.query.message;
    // Broadcast message to all connected clients
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify({ message })}\n\n`);
    });
    res.send('Message sent successfully');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
