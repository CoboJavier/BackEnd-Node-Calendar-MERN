const router = require('./auth');
const { getEventos, crearEvento, eliminarEvento, actualizarEvento, ada } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
router.use(validarJWT);

//Consultar eventos
router.get('/', getEventos);

//Crear Evento
router.post('/crearE', [
        check('title', 'Titulo es obligatorio').not().isEmpty(),
        check('start', 'la fecha de inicio es obligatorio').custom(isDate),
        check('end', 'la fecha de fin es obligatorio').custom(isDate),
        validarCampos
    ],
    crearEvento)

// Actualizar Evento
router.put(
    '/:id', [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizaciÃ³n es obligatoria').custom(isDate),
        validarCampos
    ],
    actualizarEvento
);

//Eliminar evento
router.delete('/:id', eliminarEvento)

module.exports = router;