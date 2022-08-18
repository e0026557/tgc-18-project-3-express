// *** DEPENDENCIES ***
const crypto = require('crypto');

// *** FUNCTIONS ***
const getHash = function (password) {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

function validateEmail(email) {
  let regex = /^[\w#][\w\.\’+#](.[\w\\’#]+)\@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)*(.[a-zA-Z]{2,20})$/;

  if (email.match(regex)) {
    return true;
  }
  return false;
}

function sendResponse (res, code, data) {
  let status = '';
  if ( String(code)[0] == '2') {
    status = 'success';
  }
  else if (String(code)[0] == '4') {
    status = 'fail';
  }
  
  res.status(code);
  res.json({
    status: status,
    data: data
  });
}

function sendDatabaseError(res) {
  res.status(500); // Internal server error
  res.json({
    status: 'error',
    message: 'Unable to communicate with database'
  });
}

module.exports = {
  getHash,
  validateEmail,
  sendResponse,
  sendDatabaseError
}