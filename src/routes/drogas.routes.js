const express = require('express');
const router = express.Router();
const controller = require('../controllers/drogas.controller');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

router.get('/stock/:nombre', controller.obtenerStock);
router.post('/venta', controller.registrarVenta);
router.post('/reponer', controller.reponerStock);
router.post('/crear', controller.crearDroga);
router.get('/drugs', controller.obtenerDrogas);
router.delete('/eliminar/:id', controller.eliminarDroga);
router.get('/health', (req, res) => res.send('OK'));
router.post('/subir', upload.single('archivo'), controller.subirArchivo)
module.exports = router;
