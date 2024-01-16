const {
  INVALID_TOKEN,
  NO_AUTH,
  FORBIDDEN,
} = require("../controllers/constants");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const {handleErrorResponse, handleSuccessResponse} = require("../services/helpers/responseHandler");

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
        handleErrorResponse(res, 403, FORBIDDEN, NO_AUTH);
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, res.status || 500, INVALID_TOKEN, e.message);
    }
  }
};