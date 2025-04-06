const express = require('express');
const router = express.Router();
const controller = require('../controllers/drogas.controller');

router.get('/stock/:nombre', controller.obtenerStock);
router.post('/venta', controller.registrarVenta);
router.post('/reponer', controller.reponerStock);
router.post('/crear', controller.crearDroga);
router.get('/drugs', controller.obtenerDrogas);
router.delete('/eliminar/:id', controller.eliminarDroga);
router.get('/health', (req, res) => res.send('OK'));
module.exports = router;
