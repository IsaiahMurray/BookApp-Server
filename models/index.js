// Import and define your Sequelize models
const UserModel = require('./user')
const BookModel = require('./book')
const ChapterModel = require('./chapter')
const TagModel = require('./tag')
const ReviewModel = require('./review')

// Define associations between models
ReviewModel.belongsTo(UserModel);
ReviewModel.belongsTo(BookModel); 

UserModel.hasMany(ReviewModel);
BookModel.hasMany(ReviewModel);

ReviewModel.belongsTo(UserModel);
ReviewModel.belongsTo(BookModel);

BookModel.belongsTo(UserModel, { foreignKey: 'userId' });
ChapterModel.belongsTo(BookModel, { foreignKey: 'bookId' });

BookModel.belongsToMany(TagModel, { through: 'BookTags' });
TagModel.belongsToMany(BookModel, { through: 'BookTags' });

module.exports = {
    UserModel,
    BookModel,
    ChapterModel,
    TagModel,
    ReviewModel
};