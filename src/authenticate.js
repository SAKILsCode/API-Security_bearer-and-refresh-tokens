const jwt = require('jsonwebtoken');
const User = require('./User');

async function authenticate(req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: 'Invalid Token' });
  }

  try {
    token = token.split(' ')[1];
    const decode = jwt.verify(token, 'JWT_STRONG_SECRET');

    const user = await User.findById(decode._id).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    req.user = user;
    next();
  } catch (e) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
}

module.exports = authenticate;
