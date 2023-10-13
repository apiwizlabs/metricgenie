const errorHandler = (error, req, res) => {
  loggers.error(error)
  res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
