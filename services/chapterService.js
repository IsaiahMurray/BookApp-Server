const { ChapterModel } = require("../models");

const createChapter = async ({ userId, bookId, title, content, chapterNumber }) => {
  try {
    // Check if chapterNumber already exists for the given bookId
    const existingChapter = await ChapterModel.findOne({
      where: {
          bookId,
          chapterNumber
      }
  });

  if (existingChapter) {
      // If a chapter with the same number exists, return a 409 Conflict error
      const error = new Error('Chapter number already exists for this book');
      error.status = 409; // Set a custom status code
      throw error;
  }
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
    const chapters = await ChapterModel.findAll({ where: { bookId } });

    if (!chapters || chapters.length === 0) {
      const error = new Error('No chapters found for this book');
      error.status = 404;
      throw error;
  }
    return chapters;
  } catch (error) {
    throw error;
  }
};

const updateChapter = async ({ chapterId, title, content, chapterNumber, userId }) => {
  try {
      // Check if the chapter exists
      const existingChapter = await ChapterModel.findOne({
          where: {
              id: chapterId,
              userId // Ensure the chapter belongs to the specified user
          }
      });

      if (!existingChapter) {
          const error = new Error('Chapter not found');
          error.status = 404; // Set the status code to 404 for resource not found
          throw error;
      }

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
    const deletedChapter = await ChapterModel.findByPk(chapterId);

    if (!deletedChapter) {
      const error = new Error("Chapter not found");
      error.status = 404;
      throw error;
    }

    await deletedChapter.destroy();

    return deletedChapter;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createChapter,
  getChaptersByBookId,
  updateChapter,
  deleteChapter,
};