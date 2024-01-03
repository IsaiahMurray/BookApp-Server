// middleware.js

const { AbilityBuilder, Ability } = require('@casl/ability');
const defineAbilitiesFor = require('./ability');

function checkPermissions(req, res, next) {
  const user = req.user; // Assuming user information is attached to the request

  if (!user) {
    // Handle unauthorized access
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const ability = defineAbilitiesFor(user);

  req.ability = ability;
  next();
}

module.exports = checkPermissions;
