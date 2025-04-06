const db = require('../db');
const path = require('path');
const { emitirActualizacionTabla } = require('../sockets/socket');

exports.obtenerStock = (req, res) => {
    const { nombre } = req.params;
    db.get('SELECT stock FROM weed WHERE nombre = ?', [nombre], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        row ? res.json(row) : res.status(404).json({ error: 'Cogollo no encontrado' });
    });
};

exports.registrarVenta = (req, res) => {
    const { nombre, cantidad } = req.body;
    db.run('UPDATE weed SET stock = stock - ? WHERE nombre = ?', [cantidad, nombre], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        emitirActualizacionTabla({ tipo: 'venta', nombre });
        res.json({ message: 'Venta registrada', stockActualizado: this.changes });
    });
};

exports.reponerStock = (req, res) => {
    const { id, cantidad } = req.body;
    db.run('UPDATE weed SET stock = ? WHERE id = ?', [cantidad, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        emitirActualizacionTabla({ tipo: 'reponer', id });
        res.json({ message: 'Stock actualizado', stockActualizado: this.changes });
    });
};

exports.crearDroga = (req, res) => {
    const { nombre, stock } = req.body;
    if (!nombre || stock === undefined) {
        return res.status(400).json({ error: 'Nombre y stock son requeridos' });
    }

    db.run('INSERT INTO weed (nombre, stock) VALUES (?, ?)', [nombre, stock], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        emitirActualizacionTabla({ tipo: 'crear', nombre });
        res.json({ message: `Droga ${nombre} creada`, id: this.lastID });
    });
};

exports.obtenerDrogas = (req, res) => {
    db.all('SELECT * FROM weed', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.eliminarDroga = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM weed WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Droga no encontrada" });
        emitirActualizacionTabla({ tipo: 'eliminar', id });
        res.json({ message: "Droga eliminada", id });
    });
};

exports.subirArchivo = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    console.log(req.file);

    res.status(200).json({
        mensaje: 'Archivo subido correctamente',
        archivo: req.file.filename,
        ruta: `/uploads/${req.file.filename}`
    });
};
