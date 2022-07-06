/**
 *
 * @param {string[]} roles
 */
function authorize(roles) {
  return (req, res, next) => {
    console.log('Current User;', req.user);
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res
      .status(403)
      .json({ message: 'You do not have enough permission' });
  };
}

module.exports = authorize;
