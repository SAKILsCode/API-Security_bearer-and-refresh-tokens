const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');

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

  res.status(200).json(token);
});

module.exports = router;
