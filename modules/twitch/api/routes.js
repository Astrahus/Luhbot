var express = require('express');
var router = express.Router();
var _ctrl = require('./controllers');

router.get('/update/user', _ctrl.updateUser);
router.get('/get/subscriptions', _ctrl.getSubscriptions);

module.exports = router;
