var express = require('express');
var router = express.Router();
var _ctrl = require('./controllers');

router.get('/turn/on'     ,_ctrl.connect);
router.get('/turn/off'    ,_ctrl.disconnect);
router.get('/ping'        ,_ctrl.ping);

module.exports = router;
