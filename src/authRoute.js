const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { addDays } = require('date-fns');
const User = require('./User');
const RefreshToken = require('./RefreshToken');

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'Email Already Exist' });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  user = new User({
    name,
    email,
    password: hash,
    role,
  });

  await user.save();
  res.status(201).json(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User Not Found' });
  }

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  // Access token
  const token = jwt.sign(
    {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    'JWT_STRONG_SECRET',
    { expiresIn: '2h' }
  );

  // Refresh token DB object
  const refreshToken = new RefreshToken({
    user: user.id,
    issuedIp: req.clientIp || 'N/A',
    token: '',
    expiredAt: addDays(new Date(), 30),
  });

  // Refresh token string
  const rToken = jwt.sign(
    {
      _id: refreshToken.id,
      user: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    'JWT_STRONG_SECRET'
  );

  refreshToken.token = rToken;
  await refreshToken.save();

  res.status(200).json({ accessToken: token, refreshToken: rToken });
});

module.exports = router;
