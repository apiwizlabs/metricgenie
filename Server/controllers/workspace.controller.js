const mongoose = require("mongoose");
const connectToDb = require("../db/db.connect");
const { workspaceModel } = require("../Models/workspace.model");
const { usersListModel } = require("../Models/UserList.model");
const moment = require("moment");

const getTotalWorkspaces = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB Client not available",
      });
      return;
    }

    const workspaceCount = await workspaceModel.estimatedDocumentCount();

    if (workspaceCount) {
      res.status(200).json({
        success: true,
        data: workspaceCount,
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
      message: "Internal server error",
    });
  }
};

const getAllWorkspaces = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB Client not available",
      });
      return;
    }

    const allWorkspaceData = await workspaceModel.find({});
    logger.debug("workspace-data: ", allWorkspaceData)

    if (allWorkspaceData) {
      res.status(200).json({
        success: true,
        data: allWorkspaceData,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getActiveWorkspaces = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB client not available",
      });
      return;
    }

    const activeWorkspaces = await workspaceModel.find({ status: "active" });
    const activeWorkspacesCount = await workspaceModel
      .find({ status: "active" })
      .countDocuments();
    if (activeWorkspaces) {
      res.status(200).json({
        success: true,
        data: activeWorkspaces,
        total: activeWorkspacesCount,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getInactiveWorkspaces = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB client not available",
      });
      return;
    }

    const inactiveWorkspaces = await workspaceModel.find({
      status: { $ne: "active" },
    });
    const inactiveWorkspacesCount = await workspaceModel
      .find({ status: { $ne: "active" } })
      .countDocuments();
    if (inactiveWorkspaces) {
      res.status(200).json({
        success: true,
        data: inactiveWorkspaces,
        total: inactiveWorkspacesCount,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getWorkspacePlanInformation = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB client not available",
      });
      return;
    }

    const workspaceId = req.params.workspaceId;

    const workspacePlanInfo = await workspaceModel
      .findOne({ tenant: workspaceId })
      .select("planId status seats paymentSchedule trialPerid isTrial");

    if (workspacePlanInfo) {
      res.status(200).json({
        success: true,
        data: workspacePlanInfo,
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
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const getWorkspaceSeatInformation = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB client not available",
      });
      return;
    }

    const workspaceId = req.params.workspaceId;
    const totalSeats = await workspaceModel
      .findOne({ tenant: workspaceId })
      .select("seats");

    const filledSeats = await usersListModel
      .where({
        "workspaces.workspace._id": workspaceId,
      })
      .countDocuments();

    if (
      typeof totalSeats.seats === "number" &&
      typeof filledSeats === "number"
    ) {
      res.status(200).json({
        success: true,
        data: {
          totalSeats: totalSeats.seats,
          filledSeats,
          availableSeats: totalSeats.seats - filledSeats,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (err) {}
};

const getMonthlyGrowthInWorkspaces = async (req, res) => {
  try {
    let db = await connectToDb();
    if (!db) {
      res.status(400).json({
        message: "DB client not available",
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

    const totalCurrentMonthWorkspaces = await workspaceModel
      .find()
      .and([
        { cts: { $gte: currentMonthStart } },
        { cts: { $lte: currentMonthEnd } },
      ])
      .lean();

    const totalPrevMonthWorkspaces = await workspaceModel
      .find()
      .and([{ cts: { $gte: prevMonthStart } }, { cts: { $lte: prevMonthEnd } }])
      .lean();

    if (totalCurrentMonthWorkspaces && totalPrevMonthWorkspaces) {
      res.status(200).json({
        success: true,
        data: {
          currentMonth: totalCurrentMonthWorkspaces.length,
          prevMonth: totalPrevMonthWorkspaces.length,
          growth:
            totalCurrentMonthWorkspaces.length -
            totalPrevMonthWorkspaces.length,
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
      errorMessage: err.message,
    });
  }
};

module.exports = {
  getTotalWorkspaces,
  getAllWorkspaces,
  getActiveWorkspaces,
  getInactiveWorkspaces,
  getWorkspacePlanInformation,
  getWorkspaceSeatInformation,
  getMonthlyGrowthInWorkspaces,
};
