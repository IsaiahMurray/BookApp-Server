const { NO_TOKEN, NO_USER, NO_AUTH } = require("../controllers/constants");
const { JWTService } = require("../services");

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
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(e.status).json({
        title: NO_AUTH,
        info: {
          message: e.message,
        },
      });
    } else {
      res.status(e.status).json({
        title: NO_AUTH,
        info: {
          message: e.message,
        },
      });
    }
  }
};

module.exports = ValidateSession;
