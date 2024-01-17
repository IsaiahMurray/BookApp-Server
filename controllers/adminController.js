require("dotenv").config();
const { AdminService, PasswordService } = require("../services/index");
const AdminController = require("express").Router();

const {
  INCORRECT_EMAIL_PASSWORD,
  ADMIN_CREATED,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  TITLE_SIGNUP_ERROR,
  DELETE_FAIL,
  DELETE_SUCCESS,
  GET_FAIL,
  GET_SUCCESS,
  NO_USER,
} = require("../controllers/constants");
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../services/helpers/responseHandler");

//* Create new Admin User
AdminController.route("/register").post(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password) {
      const error = new Error(INCORRECT_EMAIL_PASSWORD);
      error.status = 500;
      throw error;
    }

    const hashedPassword = await PasswordService.hashPassword(password);
    const userId = await AdminService.adminCreate({
      username,
      email,
      password: hashedPassword,
    });

    handleSuccessResponse(res, 201, userId, ADMIN_CREATED);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(
        res,
        e.status || 500,
        TITLE_SIGNUP_ERROR,
        e.message
      );
    }
  }
});

//* Get all Users
AdminController.route("/get/users").get(async (req, res) => {
  try {
    const allUsers = await AdminService.getAllUsers(); // Await here

    handleSuccessResponse(res, 200, allUsers, GET_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
    }
  }
});

//* Get User by ID
AdminController.route("/get/:userId").get(async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await AdminService.getById(userId);
    if (!user) {
      const error = new Error(NO_USER);
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, GET_FAIL, e.message);
    }
  }
});

//* Modify role
AdminController.route("/modify/role/:id").put(async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    const updatedRole = await AdminService.modifyRole(id, role);

    handleSuccessResponse(res, 200, updatedRole, UPDATE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, UPDATE_FAIL, e.message);
    }
  }
});

//* Delete User
AdminController.route("/delete/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;
    const destroyedUser = await AdminService.remove(id);

    handleSuccessResponse(res, 200, destroyedUser, DELETE_SUCCESS);
  } catch (e) {
    if (e instanceof Error) {
      handleErrorResponse(res, e.status || 500, DELETE_FAIL, e.message);
    }
  }
});

module.exports = AdminController;