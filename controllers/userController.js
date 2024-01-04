//! User Archive Account

const Services = require("../services/index");
const UserController = require("express").Router();
const { ValidateSession } = require("../middleware");

// Constants for error messages or success messages are imported from a separate file
const {
  INCORRECT_EMAIL_PASSWORD,
  CREATE_SUCCESS,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  TITLE_LOGIN_ERROR,
  TITLE_SIGNUP_ERROR,
  DELETE_FAIL,
  DELETE_SUCCESS,
  USER_FOUND,
} = require("../controllers/constants");

//* User register
UserController.route("/register").post(async (req, res) => {
  // Register a new user with provided username, email, and password
  // Hash password before storing in the database
  // Return success message and user ID upon successful registration
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await Services.PasswordService.hashPassword(
      password
    );
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
  // Authenticate user with provided email and password
  // Create a session token upon successful login
  // Return user details, token, and success message upon successful login
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error(INCORRECT_EMAIL_PASSWORD);

    const foundUser = await Services.UserService.getByEmail(email);

    if (!foundUser) throw new Error(INCORRECT_EMAIL_PASSWORD);
    if (
      !(await Services.PasswordService.validatePassword(
        password,
        foundUser.password
      ))
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

//* Update username
UserController.route("/update/username").put(
  ValidateSession,
  async (req, res) => {
    try {
      // Update user's username based on provided input
      // Return updated username and success message upon successful update
      const { username } = req.body;
      const { id } = req.user;

      const updatedUserName = await Services.UserService.modifyUsername(
        id,
        username
      );
      res.json({
        user: updatedUserName,
        info: {
          message: UPDATE_SUCCESS,
          username: username,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = {
          title: UPDATE_FAIL,
          info: {
            message: e.message,
          },
        };
        res.send(errorMessage);
      }
    }
  }
);

//* Update email
UserController.route("/update/email").put(ValidateSession, async (req, res) => {
  try {
    // Update user's email based on provided input
    // Return updated email and success message upon successful update
    const { email } = req.body;
    const { id } = req.user;
    const updatedUserEmail = await Services.UserService.modifyEmail(id, email);
    res.json({
      user: updatedUserEmail,
      info: {
        message: UPDATE_SUCCESS,
        email: email,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: UPDATE_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});

//* Update password
UserController.route("/update/password").put(
  ValidateSession,
  async (req, res) => {
    // Update user's password based on provided input
    // Hash the new password before storing in the database
    // Return success message upon successful update
    try {
      const { password } = req.body;
      const { id } = req.user;
      const hashedPassword = await Services.PasswordService.hashPassword(
        password
      );
      const updatedUserPass = await Services.UserService.modifyPassword(
        id,
        hashedPassword
      );
      res.json({
        user: updatedUserPass,
        info: {
          message: UPDATE_SUCCESS,
          password: password,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = {
          title: UPDATE_FAIL,
          info: {
            message: e.message,
          },
        };
        res.send(errorMessage);
      }
    }
  }
);

//! User Archive Account

//* User delete
UserController.route("/delete").delete(ValidateSession, async (req, res) => {
  // Delete user account based on user ID from the session
  // Return success message upon successful account deletion
  try {
    const { id } = req.user;
    const destroyedUser = await Services.UserService.remove(id);

    res.status(200).json({
      destroyedUser,
      info: {
        message: DELETE_SUCCESS,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: DELETE_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});

module.exports = UserController;
