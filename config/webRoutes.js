const express  = require('express');
const router   = express.Router();
const statics  = require('../controllers/statics');

module.exports = router;

router.route('/')
  .get(statics.home);
