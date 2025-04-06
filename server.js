require('dotenv').config();
const multer = require('multer');
const http = require('http');
const app = require('./src/app');
const { setupSocket } = require('./src/sockets/socket');

const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 4000;

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


server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
