const { NO_TOKEN, NO_USER, NO_AUTH } = require("../controllers/constants");
const { JWTService } = require("../services");
const { UserModel } = require("../models");

const LoginCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (req.method === "OPTIONS") {
      return next();
    } else if (!token) {
      return next();
    } else {
      const decodeToken = await JWTService.verifyJWT(token);
      const user = await UserModel.findOne({
        where: {
          id: decodeToken.userId,
        },
      });

      req.user = user;
      return next();
    }
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, res.status || 500, NO_AUTH, e.message);
    }
  }
};

module.exports = LoginCheck;