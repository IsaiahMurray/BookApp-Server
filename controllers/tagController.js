const Services = require('../services')
const TagController = require("express").Router();

// Constants for error messages or success messages are imported from a separate file
const {
    CREATE_SUCCESS,
    CREATE_FAIL,
    GET_SUCCESS,
    GET_FAIL,
    UPDATE_SUCCESS,
    UPDATE_FAIL,
    DELETE_FAIL,
    DELETE_SUCCESS,
    NOT_FOUND,
    CONFLICT,
  } = require("../controllers/constants");

  //! Create Tag
  TagController.route("").post(async (req, res) => {

  });

  //! Get All Tags
  TagController.route("").get(async (req, res) => {

  });
  
  //! Update Tag
  TagController.route("").put(async (req, res) => {

  });
  
  
  //! Delete Tag
  TagController.route("").delete(async (req, res) => {

  });


module.exports = TagController;