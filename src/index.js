const express = require('express');
const app = express();

// Optional: DB module and routes (won’t block startup even if DB fails)
let db;
try {
    db = require('./persistence');
} catch (err) {
    console.warn('⚠️ DB module not loaded, proceeding without database:', err.message);
}

const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

// Middleware
app.use(express.json());
app.use(express.static(__dirname + '/static'));

// Routes
app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

// ✅ Start the Express server immediately
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running and listening on port ${PORT}`);
});

// Graceful shutdown (safe even if db isn’t initialized)
const gracefulShutdown = () => {
    if (db && typeof db.teardown === 'function') {
        db.teardown()
            .catch(() => {})
            .then(() => process.exit());
    } else {
        process.exit();
    }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
