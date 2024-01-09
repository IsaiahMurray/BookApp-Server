const { ChapterModel } = require("../models");

const createChapter = async ({ bookId, title, content, chapterNumber }) => {
  try {
    const newChapter = await ChapterModel.create({
      bookId,
      title,
      content,
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

const updateChapter = async (chapterId, { title, content, chapterNumber }) => {
  try {
    //Check if the chapter exists
    const chapterToUpdate = await ChapterModel.findByPk(chapterId);

    //If no chapter, return 404
    if (!chapterToUpdate) {
      const error = new Error('Chapter not found');
      error.status = 404;
      throw error;
  }
  
    const [rowsUpdated, [updatedChapter]] = await ChapterModel.update(
      { title, content, chapterNumber },
      { where: { id: chapterId }, returning: true }
    );

    if (rowsUpdated === 0) {
      const error = new Error("Chapter update failed");
      error.status = 500;
      throw error;
    }

    return updatedChapter;
  } catch (error) {
    throw error;
  }
};

const patchChapter = async (chapterId, propertyName, propertyValue) => {
  try {
    const chapter = await ChapterModel.findByPk(chapterId);

    if (!chapter) {
      const error = new Error("Chapter not found");
      error.status = 404;
      throw error;
    }

    chapter[propertyName] = propertyValue;

    const updatedChapter = await chapter.save();

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
  patchChapter,
  deleteChapter,
};