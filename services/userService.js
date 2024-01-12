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

//? Upload Profile Picture
const uploadProfilePicture = async (userId, filePath) => {
  try {
    const uploaded = await UserModel.update(
      { profilePicture: filePath },
      { where: { id: userId } }
    );

    return uploaded;
  } catch (e) {
    throw e;
  }
};

//? Remove Profile Picture
const removeProfilePicture = async (userId) => {
  try {
    // Remove the user's profilePicture in the database
    const removedPicture = await UserModel.update(
      { profilePicture: null },
      { where: { id: userId } }
    );

    return removedPicture;
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
  uploadProfilePicture,
  removeProfilePicture
};
