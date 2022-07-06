const router = require('express').Router();
const authenticate = require('./authenticate');
const authorize = require('./authorize');

router.get(
  '/public',
  authenticate,
  authorize(['user', 'admin']),
  (req, res) => {
    res.status(200).json({ message: 'I am public route', user: req.user });
  }
);

router.get(
  '/protected',
  authenticate,
  authorize(['admin']),
  (req, res) => {
    res.status(200).json({ message: 'I am protected route', user: req.user });
  }
);

module.exports = router;
