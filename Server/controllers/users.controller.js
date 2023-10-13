const connectToDb = require("../db/db.connect");
const { usersListModel } = require("../Models/UserList.model");
const { userSessionListModel } = require("../Models/UserSessionList.model");
const moment = require("moment");

const getUsersCount = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const usersCount = await usersListModel.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      data: usersCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUsersByWorkspace = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        success: false,
        message: "DB client not found",
      });
      return;
    }

    const workspaceId = req.params.workspaceId;

    const usersInWorkspace = await usersListModel.find({
      "workspaces.workspace._id": workspaceId,
    });

    const totalUsersInWorkspace = await usersListModel
      .where({
        "workspaces.workspace._id": workspaceId,
      })
      .countDocuments();

    if (usersInWorkspace) {
      res.status(200).json({
        success: true,
        data: usersInWorkspace,
        total: totalUsersInWorkspace,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const usersData = await usersListModel.find({});
    res.status(200).json({
      success: true,
      data: usersData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getMonthlyGrowthOfUsers = async (req, res) => {
  try {
    let db = await connectToDb();
    if (!db) {
      res.status(400).json({
        success: false,
        message: "DB client not found",
      });
      return;
    }

    const currentMonthStart = moment().startOf("month").valueOf();
    const prevMonthStart = moment()
      .subtract(1, "months")
      .startOf("month")
      .valueOf();
    const currentMonthEnd = moment().endOf("month").valueOf();
    const prevMonthEnd = moment()
      .subtract(1, "months")
      .endOf("month")
      .valueOf();

    const totalCurrentMonthUsers = await usersListModel
      .find()
      .and([
        { cts: { $gte: currentMonthStart } },
        { cts: { $lte: currentMonthEnd } },
      ])
      .lean();

    const totalPrevMonthUsers = await usersListModel
      .find()
      .and([{ cts: { $gte: prevMonthStart } }, { cts: { $lte: prevMonthEnd } }])
      .lean();

    if (totalCurrentMonthUsers && totalPrevMonthUsers) {
      res.status(200).json({
        success: true,
        data: {
          currentMonth: totalCurrentMonthUsers.length,
          prevMonth: totalPrevMonthUsers.length,
          growth: totalCurrentMonthUsers.length - totalPrevMonthUsers.length,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getUsersCount,
  getUsersByWorkspace,
  getAllUsers,
  getMonthlyGrowthOfUsers,
};
