// middleware/multerMiddleware.js
const multer = require("multer");
const path = require("path");
const { UserModel } = require("../models"); // Import your UserModel

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + fileExtension;

    // Save the file name to the user's profilePicture
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
