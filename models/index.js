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
BookModel.hasMany(
  ReviewModel,
  { foreignKey: "bookId" },
  { onDelete: "CASCADE", hooks: true }
);

ReviewModel.belongsTo(UserModel, { foreignKey: "userId" });
ReviewModel.belongsTo(BookModel, { foreignKey: "bookId" });

BookModel.belongsTo(
  UserModel,
  { foreignKey: "userId" },
  { onDelete: "CASCADE", hooks: true }
);
ChapterModel.belongsTo(
  BookModel,
  { foreignKey: "bookId" },
  { onDelete: "CASCADE", hooks: true }
);

BookModel.belongsToMany(TagModel, { through: "BookTags", as: "bookTags" });
TagModel.belongsToMany(BookModel, { through: "BookTags", as: "tagBooks" });

ChapterModel.belongsTo(
  UserModel,
  { foreignKey: "userId", as: "user" },
  { onDelete: "CASCADE", hooks: true }
);

module.exports = {
  UserModel,
  BookModel,
  ChapterModel,
  TagModel,
  ReviewModel,
};
