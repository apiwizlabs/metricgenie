const { switchDB } = require("../db/switchDb");
const connectToDb = require("../db/db.connect");
const { OAS2Schema } = require("../Schemas/OAS2.schema");
const { OAS3Schema } = require("../Schemas/OAS3.schema");
const { TestSuiteSchema } = require("../Schemas/Testsuite.schema");
const { MonitorSchema } = require("../Schemas/Monitor.schema");
const { MocksSchema } = require("../Schemas/Mocks.schema");
const { KongSchema } = require("../Schemas/Kong.schema");
const { ApigeeSchema } = require("../Schemas/Apigee.schema");
const { ApigeeXSchema } = require("../Schemas/ApigeeX.schema");
const { usersListModel } = require("../Models/UserList.model");
const { workspaceModel } = require("../Models/workspace.model");
const moment = require("moment");

const getSwagger2Count = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const OAS2Model = db.model("OAS2List", OAS2Schema, "Design.Swagger.List");
    const distinctSwaggerIds = await OAS2Model.find({}).distinct("swaggerId");

    if (distinctSwaggerIds) {
      res.status(200).json({
        success: true,
        data: distinctSwaggerIds.length,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getSwagger3Count = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const OAS3Model = db.model("OAS3List", OAS3Schema, "Design.Swagger3.List");

    const distinctSwagger3Ids = await OAS3Model.find({}).distinct("swaggerId");

    if (distinctSwagger3Ids) {
      res.status(200).json({
        success: true,
        data: distinctSwagger3Ids.length,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTestsuitesCount = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const TestsuiteModel = db.model(
      "TestsuiteList",
      TestSuiteSchema,
      "Test.Collections.List"
    );

    const TestsuitesCount = await TestsuiteModel.estimatedDocumentCount();

    if (TestsuitesCount) {
      res.status(200).json({
        success: true,
        data: TestsuitesCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getMonitoringCount = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const MonitorModel = db.model(
      "MonitorList",
      MonitorSchema,
      "Monitor.Collections.List"
    );

    const MonitoringCount = await MonitorModel.estimatedDocumentCount();

    if (MonitoringCount) {
      res.status(200).json({
        success: true,
        data: MonitoringCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getMocksCount = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const MocksModel = db.model(
      "MockList",
      MocksSchema,
      "Mock.Expectation.List"
    );

    const MocksCount = await MocksModel.estimatedDocumentCount();

    if (MocksCount) {
      res.status(200).json({
        success: true,
        data: MocksCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getKongConnectorCount = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const KongModel = db.model(
      "KongList",
      KongSchema,
      "Connectors.Kong.Runtime.List"
    );

    const KongCount = await KongModel.estimatedDocumentCount();

    if (KongCount) {
      res.status(200).json({
        success: true,
        data: KongCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getApigeeConnectorCount = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const ApigeeModel = db.model(
      "ApigeeList",
      ApigeeSchema,
      "Connectors.Apigee.Configuration"
    );

    const ApigeeCount = await ApigeeModel.estimatedDocumentCount();

    if (ApigeeCount) {
      res.status(200).json({
        success: true,
        data: ApigeeCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getApigeeXConnectorCount = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    let db = await switchDB(workspaceId);

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const ApigeexModel = db.model(
      "apigeeXConfigList",
      ApigeeXSchema,
      "Connectors.ApigeeX.Configuration"
    );

    const ApigeeXCount = await ApigeexModel.estimatedDocumentCount();

    if (ApigeeXCount) {
      res.status(200).json({
        success: true,
        data: ApigeeXCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getMonthlyCountOfUsersWorkspaces = async (req, res) => {
  try {
    let db = await connectToDb();

    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const year = req.params.year;
    // check if year given is negative or more than current year
    if (Number(year) < 0 || Number(year) > moment().year()) {
      return res.status(404).json({
        success: false,
        message: "Invalid Year",
      });
    } else {
      let result = [];

      // traverse through all months and query for cts in date range of each month
      for (let monthNum = 0; monthNum < 12; monthNum++) {
        const startDate = moment([year, monthNum]);
        const monthStartDate = moment(startDate).startOf("month").valueOf();
        const monthEndDate = moment(startDate).endOf("month").valueOf();

        // query for users and workspace in this range
        const totalCurrentMonthUsers = await usersListModel
          .find()
          .and([
            { cts: { $gte: monthStartDate } },
            { cts: { $lte: monthEndDate } },
          ])
          .lean();

        const totalCurrentMonthWorkspaces = await workspaceModel
          .find()
          .and([
            { cts: { $gte: monthStartDate } },
            { cts: { $lte: monthEndDate } },
          ])
          .lean();

        result[monthNum] = {
          users: totalCurrentMonthUsers ? totalCurrentMonthUsers.length : 0,
          workspaces: totalCurrentMonthWorkspaces
            ? totalCurrentMonthWorkspaces.length
            : 0,
          month: monthNum + 1,
        };
      }

      if (result) {
        res.status(200).json({
          success: true,
          data: result,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getSwagger2Count,
  getSwagger3Count,
  getTestsuitesCount,
  getMonitoringCount,
  getMocksCount,
  getKongConnectorCount,
  getApigeeConnectorCount,
  getApigeeXConnectorCount,
  getMonthlyCountOfUsersWorkspaces,
};
