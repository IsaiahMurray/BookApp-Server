//* User register
//* User login
//! Patch email/username
//! Update password
//! User delete
//! Upload pic
//! Get pic
//! Delete pic

const Services = require("../services/index");
const UserController = require("express").Router();
const { ValidateSession } = require("../middleware");

const {
    INCORRECT_EMAIL_PASSWORD,
    CREATE_SUCCESS,
    GET_SUCCESS,
    UPDATE_SUCCESS,
    UPDATE_FAIL,
    TITLE_LOGIN_ERROR,
    TITLE_SIGNUP_ERROR,
    DELETE_FAIL,
    DELETE_SUCCESS,
    USER_FOUND
  } = require("../controllers/constants");

  //* User register
  UserController.route("/register").post(async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const hashedPassword = await Services.PasswordService.hashPassword(password);
      const userId = await Services.UserService.create({
        username,
        email,
        password: hashedPassword,
      });
  
      res.json({
        userId,
        info: {
          message: CREATE_SUCCESS,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = {
          title: TITLE_SIGNUP_ERROR,
          info: {
            message:
              e.message === "Validation error" ? e.original.detail : e.message,
          },
        };
        res.send(errorMessage);
      }
    }
  });

  //* User login
  UserController.route("/login").post(async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) throw new Error(INCORRECT_EMAIL_PASSWORD);
  
      const foundUser = await Services.UserService.getByEmail(email);
  
      if (!foundUser) throw new Error(INCORRECT_EMAIL_PASSWORD);
      if (
        !(await Services.PasswordService.validatePassword(password, foundUser.password))
      )
        throw new Error(INCORRECT_EMAIL_PASSWORD);
  
      const userId = foundUser?.id;
      const token = await Services.JWTService.createSessionToken(userId);
  
      res.json({
        user: foundUser,
        token: token,
        info: {
          message: USER_FOUND,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = {
          title: TITLE_LOGIN_ERROR,
          info: {
            message: e.message,
          },
        };
        res.send(errorMessage);
      }
    }
  });

//! Patch email/username


//! Update password
//! User delete
//! Upload pic
//! Get pic
//! Delete pic
  
  module.exports = UserController;