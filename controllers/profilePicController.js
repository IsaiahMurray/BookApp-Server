const multer = require('multer');
const path = require('path');
const UserModel = require('..models/'); // Assuming your User model is imported here

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to save the uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Assign a unique filename
  }
});

const upload = multer({ storage: storage });

// Function to upload profile picture
const uploadProfilePicture = upload.single('profilePicture'); // Assuming 'profilePicture' is the field name in the form

const uploadProfilePictureHandler = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please provide an image file' });
  }

  // Update the user's profile with the profile picture path
  const profilePicturePath = req.file.path; // Assuming the file path is available in req.file
  const userId = req.user.id; // Assuming you have authentication middleware providing the user ID

  UserModel.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.profilePicture = profilePicturePath;
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: 'Profile picture uploaded successfully' });
    })
    .catch((error) => {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

// Function to get user's profile picture
const getProfilePicture = (req, res) => {
  const userId = req.user.id; // Assuming you have authentication middleware providing the user ID

  UserModel.findByPk(userId)
    .then((user) => {
      if (!user || !user.profilePicture) {
        return res.status(404).json({ error: 'Profile picture not found' });
      }

      res.sendFile(user.profilePicture);
    })
    .catch((error) => {
      console.error('Error fetching profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

// Function to delete user's profile picture
const deleteProfilePicture = (req, res) => {
  const userId = req.user.id; // Assuming you have authentication middleware providing the user ID

  UserModel.findByPk(userId)
    .then((user) => {
      if (!user || !user.profilePicture) {
        return res.status(404).json({ error: 'Profile picture not found' });
      }

      // Delete the profile picture file from the filesystem
      const profilePicturePath = user.profilePicture;
      fs.unlink(profilePicturePath, (err) => {
        if (err) {
          console.error('Error deleting profile picture:', err);
          return res.status(500).json({ error: 'Failed to delete profile picture' });
        }

        // Clear the profile picture path in the user's record
        user.profilePicture = null;
        user.save().then(() => {
          res.status(200).json({ message: 'Profile picture deleted successfully' });
        });
      });
    })
    .catch((error) => {
      console.error('Error deleting profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

module.exports = {
  uploadProfilePictureHandler,
  getProfilePicture,
  deleteProfilePicture,
};
