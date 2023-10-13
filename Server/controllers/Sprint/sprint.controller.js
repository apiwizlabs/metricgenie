const { SprintSchema } = require("../../Schemas/Sprint/Sprint.schema");
const { MilestoneSchema } = require("../../Schemas/Sprint/Milestone.schema");
const { TaskSchema } = require("../../Schemas/Sprint/Task.schema");
const sprintDbConnect = require("../../db/sprintDb.connect");
const { model } = require("mongoose");
const Logger = require("../../utils/logger");

const getAllSprints = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const status = req.query.status;
    const sprintModel = db.model("sprint", SprintSchema);

    if (!status) {
      const allSprints = await sprintModel
        .find({})
        .select("-milestones -completionPercentage")
        .sort({ cts: -1 })


      return res.status(200).json({
        success: true,
        data: allSprints,
      });
    } else {
      const filteredSprints = await sprintModel
        .find({ status: status?.toUpperCase() })
        .select("-milestones -completionPercentage")
        .sort({ cts: -1 })
      if (filteredSprints) {
        return res.status(200).json({
          success: true,
          data: filteredSprints,
        });
      } else {
        return res.status(404).send();
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createNewSprint = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const sprintBody = req.body;

    const sprintModel = db.model("sprint", SprintSchema);
    const newSprintToSave = new sprintModel(sprintBody);
    newSprintToSave.save((err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error in creating sprint",
          errorMessage: err.message
        })
      } else {
        return res.status(201).json({
          success: true,
          message: "Sprint created",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errormessage: err.message
    });
  }
};

const getSprintById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const expand = req.query.expand;
    const sprintId = req.params.sprintId;
    const sprintModel = db.model("sprint", SprintSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    const milestones = await sprintModel
      .findOne({ _id: sprintId })
      .select("milestons -_id")
      .populate({ path: "milestones", model: milestoneModel })
      .lean();

    let totalDone = 0,
      totalTasks = 0;
    milestones.milestones.forEach((milestone) => {
      totalTasks += milestone.tasks.length;
      totalDone += milestone.tasksDoneCount;
    });

    if(totalTasks){
      await sprintModel.updateOne(
        { _id: sprintId },
        { completionPercentage: (totalDone / totalTasks) * 100 }
      );
    }

    if (expand) {
      sprintModel
        .find({ _id: sprintId })
        .populate({
          path: "milestones",
          model: milestoneModel,
          populate: {
            path: "tasks",
            model: taskModel,
            populate: {
              path: "subTasks",
              model: taskModel
            }
          },
        })
        .exec((err, data) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Internal Server Error",
              errorMessage: err.message,
            });
          } else {
            return res.status(200).json({
              success: true,
              data,
            });
          }
        });
    } else {
      const foundSprint = await sprintModel
        .find({
          _id: sprintId,
        })
        .select("-milestones");

      res.status(200).json({
        success: true,
        data: foundSprint,
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

const updateSprintById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const sprintIdToUpdate = req.params.sprintId;

    const dataToUpdate = req.body;
    const sprintModel = db.model("sprint", SprintSchema);

    sprintModel
      .updateOne({ _id: sprintIdToUpdate }, dataToUpdate)
      .exec((err, data) => {
        if (err) {
          Logger.error("update error");
          res.status(500).json({
            success: false,
            message: "Sprint update error",
          });
        } else {
          Logger.debug("updated doc: ", data);
          res.status(200).json({
            success: true,
            message: "Sprint Updated",
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

const deleteSprintById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const sprintToDeleteId = req.params.sprintId;
    const sprintModel = db.model("sprint", SprintSchema);

    sprintModel.deleteOne({ _id: sprintToDeleteId }, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Sprint delete failed",
        });
      } else {
        res.status(200).send();
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllSprints,
  createNewSprint,
  getSprintById,
  updateSprintById,
  deleteSprintById,
};
