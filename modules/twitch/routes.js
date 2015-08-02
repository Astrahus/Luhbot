var express = require('express');
var router = express.Router();
var _ctrl = require('./controllers');


router.get('/subscribers/last',	_ctrl.getLastSubscription);


module.exports = router;