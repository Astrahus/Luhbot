var express = require('express');
var router = express.Router();

router.get('/login',  _ctrl.login);

module.exports = router;
