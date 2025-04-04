require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

// WebSocket conexión
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);
});

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

    io.emit('tabla-actualizada', { tipo: 'venta', nombre, cantidad }); // 🔔 Emite evento

    res.json({ message: 'Venta registrada', stockActualizado: this.changes });
  });
});

app.post('/reponer', (req, res) => {
  const { id, cantidad } = req.body;
  console.log("Actualizando stock para id:", id, "con cantidad:", cantidad);
  db.run('UPDATE weed SET stock = ? WHERE id = ?', [cantidad, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    io.emit('tabla-actualizada', { tipo: 'reponer', id, cantidad }); // 🔔 Emite evento

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

    io.emit('tabla-actualizada', { tipo: 'crear', id: this.lastID, nombre, stock }); // 🔔 Emite evento

    res.json({ message: `Droga ${nombre} creada`, id: this.lastID });
  });
});

app.get('/drugs', (req, res) => {
  db.all('SELECT * FROM weed', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.delete('/eliminar/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM weed WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Droga no encontrada" });

    io.emit('tabla-actualizada', { tipo: 'eliminar', id }); // 🔔 Emite evento

    res.json({ message: "Droga eliminada", id });
  });
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
