// *** DEPENDENCIES ***
const { User } = require("../models");
const { getHash } = require("../utilities");


// *** FUNCTIONS ***
const addUser = async function (formData) {
  // Extract user data from register form data
  const { confirm_password, ...userData } = formData;

  // Hash user's password
  userData.password = getHash(userData.password);

  // Set user role to staff
  userData.role_id = 2;

  // Create new User instance with user data
  const user = new User(userData);
  await user.save();

  return user;
}



module.exports = {
  addUser
};