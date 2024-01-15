//! User Archive Account

const { UserService, PasswordService, JWTService } = require("../services");
const UserController = require("express").Router();
const { ValidateSession, Multer } = require("../middleware");
const { UserModel } = require("../models");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../services/helpers/responseHandler");
const fs = require("fs");
const path = require("path");

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

    const hashedPassword = await PasswordService.hashPassword(password);
    const userId = await UserService.create({
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

    const foundUser = await UserService.getByEmail(email);

    if (!foundUser) throw new Error(INCORRECT_EMAIL_PASSWORD);
    if (!(await PasswordService.validatePassword(password, foundUser.password)))
      throw new Error(INCORRECT_EMAIL_PASSWORD);

    const userId = foundUser?.id;
    const token = await JWTService.createSessionToken(userId);

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

      const updatedUserName = await UserService.modifyUsername(id, username);
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
    const updatedUserEmail = await UserService.modifyEmail(id, email);
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
      const hashedPassword = await PasswordService.hashPassword(password);
      const updatedUserPass = await UserService.modifyPassword(
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
    const destroyedUser = await UserService.remove(id);

    handleSuccessResponse(res, 200, destroyedUser, DELETE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, res.status, DELETE_FAIL, e.message);
    }
  }
});

//* Upload Profile Picture
UserController.route("/upload/profile-picture").patch(
  ValidateSession,
  Multer.single("profilePicture"),
  async (req, res) => {
    try {
      // Assuming you have a user ID available (maybe from authentication middleware)
      const userId = req.user.id;

      // Update the user's profilePicture in the database
      const uploadedPic = await UserService.uploadProfilePicture(
        userId,
        req.file.path
      );

      handleSuccessResponse(res, 200, uploadedPic, UPDATE_SUCCESS);
    } catch (e) {
      if (e instanceof Error) {
        handleErrorResponse(res, res.status, UPDATE_FAIL, e.message);
      }
    }
  }
);

//* Remove Profile Picture
UserController.route("/remove/profile-picture").patch(
  ValidateSession,
  async (req, res) => {
    try {
      // Assuming you have a user ID available (maybe from authentication middleware)
      const userId = req.user.id;

      // Find the user to get the previous profile picture path
      const user = await UserModel.findByPk(userId);

      // Check if the user has a previous profile picture
      if (user && user.profilePicture) {
        // Define the path to the uploads folder
        const uploadsFolderPath = path.join(__dirname, "..");

        // Remove the previous profile picture file from the uploads folder
        const previousProfilePicturePath = path.join(
          uploadsFolderPath,
          user.profilePicture
        );
        fs.unlinkSync(previousProfilePicturePath);
        // Remove the user's profilePicture in the database
        const removedPic = await UserService.removeProfilePicture(userId);

        // Check if the cover picturehas been set to null in the model
        const updatedUser = await UserModel.findByPk(userId);

        if (updatedUser && updatedUser.profilePicture === null) {
          handleSuccessResponse(res, 200, removedPic, UPDATE_SUCCESS);
        } else {
          // If the profilePicture is not set to null in the model, handle accordingly
          handleErrorResponse(res, 500, UPDATE_FAIL, e.message);
        }
      } else {
        // If book or coverPicture is not found, handle accordingly
        handleErrorResponse(res, 404, NOT_FOUND, "Profile picture not found.");
      }
    } catch (e) {
      if (e instanceof Error) {
        handleErrorResponse(res, res.status, UPDATE_FAIL, e.message);
      }
    }
  }
);
module.exports = UserController;
