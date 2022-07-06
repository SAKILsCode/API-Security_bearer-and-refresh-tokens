const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  let token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(400).json({ message: 'Invalid Token' });
  }

  try{
    token = token.split(' ')[1];
  const user = jwt.verify(token, 'JWT_STRONG_SECRET');
  req.user = user;
  next();
  } catch (e) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
}

module.exports = authenticate;
