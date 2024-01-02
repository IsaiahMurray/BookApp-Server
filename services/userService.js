const chalk = require("chalk");
const { UserModel } = require("../models");

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

const getByEmail = async (email) => {
  try {
    const foundUser = await UserModel.findOne({ where: { email } });

    return foundUser;
  } catch (e) {
    throw e;
  }
};

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
