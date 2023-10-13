const sprintDbConnect = require("../../db/sprintDb.connect");
const { MilestoneSchema } = require("../../Schemas/Sprint/Milestone.schema");
const { SprintSchema } = require("../../Schemas/Sprint/Sprint.schema");
const { TaskSchema } = require("../../Schemas/Sprint/Task.schema");
const { Types } = require("mongoose");
const Logger = require("../../utils/logger");

const creatNewMilestone = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }
    const sprintId = req.params.sprintId;
    const sprintModel = db.model("sprint", SprintSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);

    const newMilestoneToSave = new milestoneModel(req.body);
    const savedMilestoneData = await newMilestoneToSave.save();

    const sprintToUpdate = await sprintModel.findById(Types.ObjectId(sprintId));

    if (sprintToUpdate.milestones) {
      sprintToUpdate.milestones.push(savedMilestoneData._id);
    } else {
      sprintToUpdate.milestones = [savedMilestoneData._id];
    }
    await sprintToUpdate.save();

    return res.status(201).json({
      success: true,
      message: "Milestone created",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const getMilestoneOfaSprint = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const status = req.query.status;
    const expand = req.query.expand;
    const sprintId = req.params.sprintId;
    const sprintModel = db.model("sprint", SprintSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    if (!expand && !status) {
      const milestoneData = await sprintModel
        .findOne({ _id: sprintId })
        .populate({ path: "milestones", model: milestoneModel })
        .select("milestones -_id");

      return res.status(200).json({
        success: true,
        data: milestoneData,
      });
    } else {
      if (status) {
        const milestoneData = await sprintModel
          .findOne({ _id: sprintId })
          .select("milestones -_id")
          .populate({
            path: "milestones",
            model: milestoneModel,
            populate: {
              path: "tasks",
              model: taskModel,
            },
          })
          .select("milestones -_id");

        const filteredMilestones = milestoneData.milestones.filter(
          (milestone) => milestone.status === status.toUpperCase()
        );

        return res.status(200).json({
          success: true,
          data: filteredMilestones,
        });
      } else if (expand) {
        const milestoneData = await sprintModel
          .findOne({ _id: sprintId })
          .select("milestones -_id")
          .populate({
            path: "milestones",
            model: milestoneModel,
            populate: {
              path: "tasks",
              model: taskModel,
            },
          });

        return res.status(200).json({
          success: true,
          data: milestoneData,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const getMilestoneById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const milestoneId = req.params.milestoneId;
    const sprintId = req.params.sprintId;
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const sprintModel = db.model("sprint", SprintSchema);
    const taskModel = db.model("task", TaskSchema);

    const isMilestonePresent = await sprintModel.findOne({
      _id: sprintId,
      milestones: milestoneId,
    });

    if (isMilestonePresent) {
      const milestoneData = await milestoneModel
        .findOne({ _id: milestoneId })
        .populate({
          path: "tasks",
          model: taskModel,
          populate: {
            path: "subTasks",
            model: taskModel
          }
        });

      return res.status(200).json({
        success: true,
        data: milestoneData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Milestone not found in sprint",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteMilestoneById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const milestoneModel = db.model("milestone", MilestoneSchema);
    const sprintModel = db.model("sprint", SprintSchema);

    const sprintId = req.params.sprintId;
    const milestoneId = req.params.milestoneId;

    const sprintToUpdate = await sprintModel.findOne({ _id: sprintId });

    sprintToUpdate.milestones = sprintToUpdate.milestones.filter(
      (id) => id.toString() !== milestoneId
    );

    await sprintToUpdate.save();
    await milestoneModel.deleteOne({ _id: milestoneId });

    res.status(200).send();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateMilestoneById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const milestoneId = req.params.milestoneId;
    const milestoneModel = db.model("milestone", MilestoneSchema);

    const dataToUpdate = req.body;
    await milestoneModel.updateOne({ _id: milestoneId }, dataToUpdate);

    return res.status(200).send();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getAllMilestones = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    milestoneModel.find({}).sort({ mts: -1 }).populate({
      path: "tasks",
      model: taskModel
    }).exec((err, data) => {
      if(err){
        Logger.error(err)
        return res.status(500).json({
          success: false,
          message: "Internal Server Error"
        })
      }else {
        return res.status(200).json({
          success: true,
          data
        })
      }
    })

  }catch(err){
    Logger.error(err)
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

const moveMilestoneAcrossSprints = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const sprintModel = db.model("sprint", SprintSchema)
    const milestoneModel = db.model("milestone", MilestoneSchema);

    const { sprintId, milestoneId, selectedSprintId } = req.params

    if(selectedSprintId === sprintId ){
      return res.status(409).json({
        success: false,
        message: "Milestone already exists in the sprint"
      })
    }else {

      // check if milestone exists
      const milestoneToExport = await milestoneModel.findById(milestoneId)

      if(milestoneToExport){

        // remove milestone from old sprint
        await sprintModel.updateOne({ _id: sprintId }, {
          $pull: {
            milestones: milestoneId
          }
        })

        // add milestone to new sprint
        await sprintModel.updateOne({ _id: selectedSprintId }, {
          $push : {
            milestones: milestoneId
          }
        })

        res.status(200).send()
      }else{
        return res.status(404).json({
          success: false,
          message: "Milestone does not exist"
        })
      }

    }



  }catch(err){
    Logger.error(`moveMilestoneAcrossSprints err: ${JSON.stringify(err)}`)
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

module.exports = {
  creatNewMilestone,
  getMilestoneOfaSprint,
  getMilestoneById,
  deleteMilestoneById,
  updateMilestoneById,
  getAllMilestones,
  moveMilestoneAcrossSprints
};
