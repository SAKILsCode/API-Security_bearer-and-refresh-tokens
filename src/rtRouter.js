const router = require('express').Router();
const jwt = require('jsonwebtoken');
const RefreshToken = require('./RefreshToken');
const { addDays } = require('date-fns');

router.post('/refresh', async (req, res) => {
  const { token } = req.body;

  try {
    const decode = jwt.verify(token, 'JWT_STRONG_SECRET');
    const oldRefreshToken = await RefreshToken.findById(decode._id);

    // validating refresh token
    if (!oldRefreshToken || !oldRefreshToken.isActive) {
      res.status(400).json({ message: 'Invalid Token' });
    }

    // rotating refresh token after use
    oldRefreshToken.revokedAt = new Date();
    oldRefreshToken.revokedIp = req.clientIp;
    await oldRefreshToken.save();

    // rotation: creating new refresh token and saving in DB
    const refreshToken = new RefreshToken({
      user: decode.user,
      issuedIp: req.clientIp || 'N/A',
      token: '',
      expiredAt: addDays (new Date(), 30),
    });

    const refreshTokenString = jwt.sign(
      {
        _id: refreshToken.id,
        user: decode.user,
        name: decode.name,
        email: decode.email,
        role: decode.role,
      },
      'JWT_STRONG_SECRET'
    );
    refreshToken.token = refreshTokenString;
    await refreshToken.save();

    // access token generation
    const accessToken = jwt.sign(
      {
        _id: decode.user,
        name: decode.name,
        email: decode.email,
        role: decode.role,
      },
      'JWT_STRONG_SECRET',
      { expiresIn: '30s' }
    );

    res.status(200).json({ accessToken, refreshToken: refreshTokenString });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Invalid Token' });
  }
});

router.post('/revoke', async (req, res) => {
  const { token } = req.body;

  try {
    const decode = jwt.verify(token, 'JWT_STRONG_SECRET');
    const refreshToken = await RefreshToken.findById(decode._id);

    // validating refresh token
    if (!refreshToken || !refreshToken.isActive) {
      res.status(400).json({ message: 'Invalid Token' });
    }

    // revoking refresh token
    refreshToken.revokedAt = new Date();
    refreshToken.revokedIp = req.clientIp;
    await refreshToken.save();

    res.status(200).json({ message: 'Token Revoked' });
  } catch (e) {
    res.status(400).json({ message: 'Invalid Token' });
  }
});

router.post('/valid', async (req, res) => {
  const { token } = req.body;

  try {
    const decode = jwt.verify(token, 'JWT_STRONG_SECRET');
    const refreshToken = await RefreshToken.findById(decode._id);

    // validating refresh token
    if (!refreshToken || !refreshToken.isActive) {
      res.status(400).json({ message: 'Invalid Token' });
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (e) {
    res.status(400).json({ message: 'Invalid Token' });
  }
});

module.exports = router;
