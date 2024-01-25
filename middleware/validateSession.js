const { NO_TOKEN, NO_USER, NO_AUTH } = require("../controllers/constants");
const { JWTService } = require("../services");
const { UserModel } = require("../models");
const {handleErrorResponse} = require("../services/helpers/responseHandler")

const ValidateSession = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (req.method === "OPTIONS") {
      return next();
    } else if (!token) {
      const error = new Error(NO_TOKEN);
      error.status = 403;
      throw error;
    } else {
      const decodeToken = await JWTService.verifyJWT(token);
      const user = await UserModel.findOne({
        where: {
          id: decodeToken.userId,
        },
      });

      if (!user) {
        const error = new Error(NO_USER);
        error.status = 400;
        throw error;
      }

      req.user = user;
      return next();
    }
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, NO_AUTH, e.message);
    }
  }
};

module.exports = ValidateSession;
