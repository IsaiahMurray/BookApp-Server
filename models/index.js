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
UserModel.hasMany(ReviewModel);
BookModel.hasMany(ReviewModel, { foreignKey: "bookId" }); // Ensure 'bookId' matches the foreign key in ReviewModel

ReviewModel.belongsTo(UserModel, { foreignKey: "userId" });
ReviewModel.belongsTo(BookModel, { foreignKey: "bookId" });

BookModel.belongsTo(UserModel, { foreignKey: "userId" });
ChapterModel.belongsTo(BookModel, { foreignKey: "bookId" });

BookModel.belongsToMany(TagModel, { through: "BookTags", as: "bookTags" });
TagModel.belongsToMany(BookModel, { through: "BookTags", as: "tagBooks" });

ChapterModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" }); // New association

module.exports = {
  UserModel,
  BookModel,
  ChapterModel,
  TagModel,
  ReviewModel,
};
