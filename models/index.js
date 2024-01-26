// Import and define your Sequelize models
const UserModel = require("./user");
const BookModel = require("./book");
const ChapterModel = require("./chapter");
const TagModel = require("./tag");
const ReviewModel = require("./review");
const {
  handleSuccessResponse,
} = require("../services/helpers/responseHandler");

// Define associations between models
UserModel.hasMany(ReviewModel, {
  onDelete: "CASCADE", // Cascade deletion to associated books
  hooks: true, // Enable hooks to trigger before and after changes
});

UserModel.hasMany(
  BookModel,
  {
    onDelete: "CASCADE",
    hooks: true,
  },
  { foreignKey: "userId" }
);

BookModel.belongsTo(UserModel, { foreignKey: "userId" });

UserModel.hasMany(
  ChapterModel,
  {
    onDelete: "CASCADE",
    hooks: true,
  },
  { foreignKey: "userId" }
);

ChapterModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
ChapterModel.belongsTo(BookModel, { foreignKey: "bookId" });

UserModel.hasMany(
  ReviewModel,
  {
    onDelete: "CASCADE",
    hooks: true,
  },
  { foreignKey: "userId" }
);

ReviewModel.belongsTo(UserModel, { foreignKey: "userId" });

BookModel.hasMany(
  ReviewModel,
  { foreignKey: "bookId" },
  { onDelete: "CASCADE", hooks: true }
);

ReviewModel.belongsTo(BookModel, { foreignKey: "bookId" });

BookModel.belongsToMany(TagModel, { through: "BookTags", as: "bookTags" });
TagModel.belongsToMany(BookModel, { through: "BookTags", as: "tagBooks" });

module.exports = {
  UserModel,
  BookModel,
  ChapterModel,
  TagModel,
  ReviewModel,
};
