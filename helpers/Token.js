const jwt = require("jsonwebtoken");
const config = require("../config");

const JWTtokenGenerator = async (id) => {
  const token = jwt.sign(id, config.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};
module.exports.JWTtokenGenerator = JWTtokenGenerator;
