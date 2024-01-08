require("dotenv").config();
const Services = require("../services/index");
const AdminController = require("express").Router();

const {
  INCORRECT_EMAIL_PASSWORD,
  USER_CREATED,
  ADMIN_CREATED,
  USER_FOUND,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  TITLE_LOGIN_ERROR,
  TITLE_SIGNUP_ERROR,
  DELETE_FAIL,
  DELETE_SUCCESS,
  GET_FAIL,
  GET_SUCCESS,
} = require("../controllers/constants");
const services = require("../services/index");



//* Create new Admin User
 AdminController.route("/register").post(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password) throw new Error(INCORRECT_EMAIL_PASSWORD);

    const hashedPassword = await Services.PasswordService.hashPassword(password);
    const userId = await Services.AdminService.adminCreate({
      username,
      email,
      password: hashedPassword,
    });

    res.json({
      userId,
      info: {
        message: ADMIN_CREATED,
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

//* Get all Users
AdminController.route("/get/users").get(async (req, res) => {
  try {
    const allUsers = await Services.AdminService.getAllUsers(); // Await here

    res.status(200).json({
      info: {
        message: GET_SUCCESS,
        users: allUsers
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: GET_FAIL,
        info: {
          message: e.message,
        },
      };
      res.status(500).json(errorMessage);
    }
  }
});


 //* Get User by ID
 AdminController.route("/get/:userId").get(async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Services.AdminService.getById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (e) {
    if (e instanceof Error) {
      const errorMessage = {
        title: GET_FAIL,
        info: {
          message: e.message,
        },
      };
      res.send(errorMessage);
    }
  }
});

//* Modify role
 AdminController.route("/modify/role/:id").put(async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    const updatedRole = await Services.AdminService.modifyRole(id, role);
    res.json({
      user: updatedRole,
      info: {
        message: UPDATE_SUCCESS,
        role: role
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

//! Delete User
 AdminController.route("/delete/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;
    const destroyedUser = await Services.AdminService.remove(id);

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


module.exports = AdminController;