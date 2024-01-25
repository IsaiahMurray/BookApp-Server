// ability.js

const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(user) {
  const { rules, can } = AbilityBuilder.extract();

  // Define permissions based on the user's role or any other conditions
  if (user.role === 'Admin') {
    can('manage', 'all'); // Admin has full access
  } else {
    can('read', 'all'); // Regular users can read
    can('create', 'Book'); // Example: Regular users can create books
  }

  return new Ability(rules);
}

module.exports = defineAbilitiesFor;
