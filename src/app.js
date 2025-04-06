const express = require('express');
const cors = require('cors');
const path = require('path');
const drogaRoutes = require('./routes/drogas.routes');
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // carpeta donde se guarda
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

app.post('/subir', upload.single('archivo'), (req, res) => {
    console.log(req.file); // info del archivo
    res.send('Archivo subido correctamente ✔️');
});

// Carpeta de subida accesible
app.use('/uploads', express.static('uploads'));



app.use('/', drogaRoutes);

module.exports = app;
