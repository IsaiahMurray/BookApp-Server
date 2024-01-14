const handleErrorResponse = (res, status, title, message) => {
   res.status(status).json({
    title,
    info: {
      message: message,
    },
  });
};

module.exports = { handleErrorResponse };
