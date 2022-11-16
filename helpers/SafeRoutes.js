const jwt = require("jsonwebtoken");
const config = require("../config");

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.json({
          msg: "Invalid token",
        });
      } else {
        req.userid = decodedToken.id;
        next();
      }
    });
  } else {
    return res.json({
      msg: "Please login",
    });
  }
};

module.exports = {
  isAuthenticated: isAuthenticated,
};
