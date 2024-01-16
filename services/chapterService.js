const { NOT_FOUND } = require("../controllers/constants");
const { ChapterModel } = require("../models");

const createChapter = async ({ userId, bookId, title, content, chapterNumber }) => {
  try {
    // Replace manual line breaks with '\n' escape sequence
    const formattedContent = content.replace(/\r?\n|\r/g, '\\n');

    const newChapter = await ChapterModel.create({
      userId,
      bookId,
      title,
      content: formattedContent,
      chapterNumber,
    });
    return newChapter;
  } catch (error) {
    throw error;
  }
};

const getChaptersByBookId = async (bookId) => {
  try {
    // Find all chapters associated with the specified bookId
    const chapters = await ChapterModel.findAll({ where: { bookId } });

    // If chapters are found, return the array of chapters
    return chapters;
  } catch (error) {
    // If any error occurs during the retrieval process, throw the error
    throw error;
  }
};

const updateChapter = async ({ chapterId, title, content, chapterNumber, userId }) => {
  try {
      // Replace manual line breaks with '\n' escape sequence
      const formattedContent = content.replace(/\r?\n|\r/g, '\\n');

      // Update the chapter with the formatted content
      const updatedChapter = await existingChapter.update({
          title,
          content: formattedContent,
          chapterNumber,
          userId
      });
      
      return updatedChapter;
  } catch (error) {
      throw error;
  }
};

const deleteChapter = async (chapterId) => {
  try {
    // Find the chapter by its primary key (chapterId)
    const deletedChapter = await ChapterModel.findByPk(chapterId);

    // Check if the chapter exists
    if (!deletedChapter) {
      // If the chapter doesn't exist, create an error object
      const error = new Error(NOT_FOUND);
      error.status = 404; // Set the status code to 404 for resource not found
      throw error; // Throw the error to handle it further
    }

    // If the chapter exists, delete it from the database
    await deletedChapter.destroy();

    // Return the deleted chapter object after successful deletion
    return deletedChapter;
  } catch (error) {
    // If any error occurs during the deletion process, throw the error
    throw error;
  }
};


module.exports = {
  createChapter,
  getChaptersByBookId,
  updateChapter,
  deleteChapter,
};