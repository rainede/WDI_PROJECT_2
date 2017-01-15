const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
const users           = require('../controllers/users');

module.exports = router;

router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);
