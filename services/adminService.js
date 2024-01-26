const { UserModel } = require("../models");

const adminCreate = async ({ username, email, password }) => {
  try {
    const newAdmin = await UserModel.create({
      username,
      email,
      password,
      role: "admin",
    });

    return newAdmin;
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

const getById = async (id) => {
  const foundUser = await UserModel.findOne({ where: { id } });
  return foundUser;
};

const getAllUsers = async () => {
  try {
    const users = await UserModel.findAll();
    return users;
  } catch (e) {
    throw e;
  }
};

const modifyRole = async (id, role) => {
  try {
    const updatedUser = await UserModel.update(
      { role: role },
      {
        where: { id: id },
        returning: true
      }
    );
    return updatedUser;
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
      returning: true
    });
    return deletedUser;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  adminCreate,
  getAllUsers,
  getByEmail,
  getById,
  modifyRole,
  remove,
};
