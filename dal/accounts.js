// *** DEPENDENCIES ***
const { User, BlacklistedToken } = require('../models');
const { getHash } = require('../utilities');

// *** FUNCTIONS ***
const addUser = async function (userData, roleId = 1) {
  // Hash user's password
  userData.password = getHash(userData.password);

  // Set user role to staff
  userData.role_id = roleId;

  // Create new User instance with user data
  const user = new User(userData);
  await user.save();

  return user;
};

const getUserByCredentials = async function (formData) {
  const user = await User.where({
    username: formData.username,
    password: getHash(formData.password)
  }).fetch({
    require: false,
    withRelated: [
      'role'
    ]
  });

  return user ? user : false; // Return user if exists, else false
}

const getBlacklistedToken = async function (refreshToken) {
  const blacklistedToken = await BlacklistedToken.where({
    token: refreshToken
  }).fetch({
    require: false
  });

  return blacklistedToken;
}

module.exports = {
  addUser,
  getUserByCredentials,
  getBlacklistedToken
};
