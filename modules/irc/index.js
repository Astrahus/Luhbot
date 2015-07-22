var express = require('express');
var router = express.Router();
var _ctrl = require('./controllers');

router.get('/ligar' ,_ctrl.conectar)

module.exports = router;
