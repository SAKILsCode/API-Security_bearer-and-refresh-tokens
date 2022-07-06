const router = require('express').Router();
const passport = require('passport');
// const authenticate = require('./authenticate');

router.get('/public', (req, res) => {
  res.status(200).json({ message: 'I am public route' });
});
router.get(
  '/protected',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.status(200).json({ message: 'I am protected route', user: req.user });
  }
);

module.exports = router;
