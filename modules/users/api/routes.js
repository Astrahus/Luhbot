var express = require('express'),
  router = express.Router(),
  _ctrl = require('./controller');

router.get('/'    ,_ctrl.getAll);
router.get('/:id' ,_ctrl.getOne);
router.put('/'    ,_ctrl.createUser);
router.post('/'   ,_ctrl.editUser);

module.exports = router;
