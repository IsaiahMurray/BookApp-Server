const {
  INVALID_TOKEN,
  TOKEN_ERROR,
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
        return res.status(500).send("Not Authorized");
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: TOKEN_ERROR,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
};
