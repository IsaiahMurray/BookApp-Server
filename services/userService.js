const chalk = require("chalk");
const { UserModel } = require("../models");

//? Register User
const create = async ({ username, email, password }) => {
  try {
    const newUser = await UserModel.create({
      username,
      email,
      password,
      role: "user",
    });

    return newUser;
  } catch (e) {
    throw e;
  }
};

//? Get User by Email
const getByEmail = async (email) => {
  try {
    const foundUser = await UserModel.findOne({ where: { email } });

    return foundUser;
  } catch (e) {
    throw e;
  }
};

//? Update Username
const modifyUsername = async (id, username) => {
  try {
    const updatedUser = await UserModel.update(
      {
        username: username,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updatedUser;
  } catch (e) {
    throw e;
  }
};

//? Update Email
const modifyEmail = async (id, email) => {
  try {
    const updatedUser = await UserModel.update(
      {
        email: email,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updatedUser;
  } catch (e) {
    throw e;
  }
};

//? Update Password
const modifyPassword = async (id, password) => {
  try {
    const updatedUserPass = await UserModel.update(
      {
        password: password,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updatedUserPass;
  } catch (e) {
    throw e;
  }
};

//? Delete User
const remove = async (id) => {
  try {
    const deletedUser = await UserModel.destroy({
      where: {
        id: id,
      },
    });
    return deletedUser;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
  getByEmail,
  modifyUsername,
  modifyEmail,
  modifyPassword,
  remove,
};
