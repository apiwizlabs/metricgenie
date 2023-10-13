const { UserSchema } = require("../../Schemas/user.schema");
const sprintDbConnect = require("../../db/sprintDb.connect");

const getSprintUsers = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const usersModel = db.model("users.list", UserSchema);

    usersModel.find({}, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error in getting users",
          errorMessage: err.message,
        });
      } else {
        return res.status(200).json({
          success: true,
          data,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getSprintUsers }
