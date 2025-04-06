const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/drogas.controller');

router.get('/stock/:nombre', controller.obtenerStock);
router.post('/venta', controller.registrarVenta);
router.post('/reponer', controller.reponerStock);
router.post('/crear', controller.crearDroga);
router.get('/drugs', controller.obtenerDrogas);
router.delete('/eliminar/:id', controller.eliminarDroga);
router.post('/upload', upload.single('archivo'), controller.subirArchivo);
router.get('/health', (req, res) => res.send('OK'));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
    console.log(req.url);
    console.log(__dirname)
})

module.exports = router;
