const handleErrorResponse = (res, status, title, message) => {
   res.status(status).json({
    title,
    info: {
      message: message,
    },
  });
};

const handleSuccessResponse = (res, status, content, message) => {
  res.status(status).json({
    message: message,
    content,
  });
}
module.exports = { handleErrorResponse, handleSuccessResponse };