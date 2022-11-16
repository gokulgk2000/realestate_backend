const bcrypt = require("bcrypt");

const hashGenerator = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
const hashValidator = async (userPassword, hashPassword) => {
  return await bcrypt.compare(userPassword, hashPassword);
};
module.exports.hashGenerator = hashGenerator;
module.exports.hashValidator = hashValidator;
