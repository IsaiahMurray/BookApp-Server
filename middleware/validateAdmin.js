const {
  INVALID_TOKEN,
  NO_AUTH,
} = require("../controllers/constants");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
      if (!err && decodeToken) {
        UserModel.findOne({
          where: {
            id: decodeToken.userId,
            role: "admin",
          },
        })
          .then((user) => {
            if (!user) throw err;

            req.user = user;
            return next();
          })
          .catch((err) => next(err));
      } else {
        req.errors = err;
        return res.status(403).send(NO_AUTH);
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: INVALID_TOKEN,
        info: {
          message: e.message,
        },
      };
      errorMessage.status(500);
      res.send(errorMessage);
    }
  }
};