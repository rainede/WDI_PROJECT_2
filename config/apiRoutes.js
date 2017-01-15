const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
const users           = require('../controllers/users');
const journeys           = require('../controllers/journeys');

module.exports = router;

router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);

router.route('/users')
  .get(users.index);

router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);


router.route('/journeys')
  .get(journeys.index);

router.route('/journeys/:id')
  .get(journeys.show)
  .put(journeys.update)
  .delete(journeys.delete);
