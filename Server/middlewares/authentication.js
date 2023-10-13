const jwt = require("jsonwebtoken");
const sprintDbConnect = require("../db/sprintDb.connect");
const config = require("../config");
const { UserSchema } = require("../Schemas/user.schema");

const checkAuthentication = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized message! Token missing",
        });
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);

    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }
    const usersListModel = db.model("users.list", UserSchema)
    const isUserExists = await usersListModel.find({ email: decoded.email });
    if (isUserExists) {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Error in authenticating"
      })
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access! token error",
      errorMessage: err.message,
    });
  }
};

module.exports = { checkAuthentication, isAuthenticated };
