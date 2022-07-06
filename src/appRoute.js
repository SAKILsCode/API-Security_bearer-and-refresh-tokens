const router = require('express').Router();

router.post('/public', (req, res) => {
  res.status(200).json({ message: 'I am public route' });
});
router.post('/protected', (req, res) => {
  res.status(200).json({ message: 'I am protected route', user: req.user });
});

module.exports = router;
