var express = require('express');
var router = express.Router();
var _ctrl = require('./controllers');

router.get('/update/user', _ctrl.updateUser);
router.get('/subscriptions/', _ctrl.getSubscriptions);
router.get(['/subscriptions/last','/subscriptions/last/:param'], _ctrl.getLastSubscription);

module.exports = router;
