var express = require('express');
var router = express.Router();
var _ctrl = require('./controllers');

router.get('/login',  _ctrl.login);

module.exports = router;
