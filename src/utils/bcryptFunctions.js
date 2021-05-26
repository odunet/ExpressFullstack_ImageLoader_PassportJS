//password encrypton package
const bcrypt = require('bcryptjs');

async function validPassword(password, hash) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (err) {
    console.log(err);
  }
}

module.exports.validPassword = validPassword;
