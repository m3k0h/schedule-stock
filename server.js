require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // Servidor HTTP
const io = new Server(server, {
    cors: {
        origin: "*", // Ajustá si querés restringirlo
        methods: ["GET", "POST", "DELETE"]
    }
});

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

// Socket.io conexión
io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado');

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
});

// Emitir evento al cliente cuando cambia algo en la tabla
function emitirActualizacionTabla(data = {}) {
    io.emit('tabla-actualizada', data);
}

app.get('/stock/:nombre', (req, res) => {
    const { nombre } = req.params;
    db.get('SELECT stock FROM weed WHERE nombre = ?', [nombre], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        row ? res.json(row) : res.status(404).json({ error: 'Cogollo no encontrado' });
    });
});

app.post('/venta', (req, res) => {
    const { nombre, cantidad } = req.body;
    db.run('UPDATE weed SET stock = stock - ? WHERE nombre = ?', [cantidad, nombre], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        emitirActualizacionTabla({ tipo: 'venta', nombre });
        res.json({ message: 'Venta registrada', stockActualizado: this.changes });
    });
});

app.post('/reponer', (req, res) => {
    const { id, cantidad } = req.body;
    console.log("Actualizando stock para id:", id, "con cantidad:", cantidad);
    db.run('UPDATE weed SET stock = ? WHERE id = ?', [cantidad, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        emitirActualizacionTabla({ tipo: 'reponer', id });
        res.json({ message: 'Stock actualizado', stockActualizado: this.changes });
    });
});

app.post('/crear', (req, res) => {
    const { nombre, stock } = req.body;
    if (!nombre || stock === undefined) {
        return res.status(400).json({ error: 'Nombre y stock son requeridos' });
    }

    db.run('INSERT INTO weed (nombre, stock) VALUES (?, ?)', [nombre, stock], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        emitirActualizacionTabla({ tipo: 'crear', nombre });
        res.json({ message: `Droga ${nombre} creada`, id: this.lastID });
    });
});

app.get('/drugs', (req, res) => {
    db.all('SELECT * FROM weed', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/eliminar/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM weed WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Droga no encontrada" });

        emitirActualizacionTabla({ tipo: 'eliminar', id });
        res.json({ message: "Droga eliminada", id });
    });
});

app.get('/health', (req, res) => res.send('OK'));

// Iniciar servidor HTTP+Socket
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
