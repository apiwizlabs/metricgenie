const {
  ReleaseSchema,
} = require("../../Schemas/ReleaseTracker/Release.Schema");
const sprintDbConnect = require("../../db/sprintDb.connect");
const Logger = require("../../utils/logger");
const { MilestoneSchema } = require("../../Schemas/Sprint/Milestone.schema");
const { TaskSchema } = require("../../Schemas/Sprint/Task.schema");
const { Types } = require("mongoose");

const getReleases = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const releaseModel = db.model("release", ReleaseSchema);

    releaseModel.find({}, (err, data) => {
      if (err) {
        Logger.error(err);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          errorMessage: err.message,
        });
      } else {
        Logger.debug(data);
        return res.status(200).json({
          success: true,
          data,
        });
      }
    });
  } catch (err) {
    Logger.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const getReleaseById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const releaseId = req.params.releaseId;
    const releaseModel = db.model("release", ReleaseSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    releaseModel
      .findById(releaseId)
      .populate([
        {
          path: "milestones",
          model: milestoneModel,
          select: { tasks: 0 },
        },
        {
          path: "tasks",
          model: taskModel,
        },
      ])
      .exec((err, data) => {
        if (err) {
          Logger.error(err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errorMessage: err.message,
          });
        } else {
          Logger.debug("release data: ", data);
          return res.status(200).json({
            success: true,
            data,
          });
        }
      });
  } catch (err) {
    Logger.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const createNewRelease = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      return res.status(400).json({
        message: "DB client not found",
      });
    }

    // will not contain the milestone array here, only meta info of release
    const releaseBody = req.body;
    console.log("release body: ", releaseBody);
    // now the milestones need to be tagged to current release
    const releaseModel = db.model("release", ReleaseSchema);

    const releaseToSave = new releaseModel(releaseBody);
    releaseToSave.save((err, data) => {
      if (err) {
        Logger.error(err);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          errorMessage: err.message,
        });
      } else {
        Logger.debug(data);
        return res.status(200).send();
      }
    });
  } catch (err) {
    Logger.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const deleteTaskFromRelease = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      return res.status(400).json({
        message: "DB client not found",
      });
    }

    const releaseId = req.params.releaseId;
    const taskId = req.params.taskId;
    const releaseModel = db.model("release", ReleaseSchema);
    const taskModel = db.model("task", TaskSchema);

   releaseModel.findById(releaseId)
   .exec(async (err, data) => {
    if (err) {
      Logger.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessage: err.message,
      });
    } else {
      let taskToUpdate = await taskModel.findOne({ _id: taskId });
       taskToUpdate.releaseInfo = {};      
       taskToUpdate.save((err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errorMessage: err.message,
          });
        }
      });

      let updatedTaskList = [];
      updatedTaskList = data._doc.tasks.filter(task => task.toString() != Types.ObjectId(taskId));
      let updatedRelease = {...data, _doc: {...data._doc, tasks: updatedTaskList }}


        releaseModel.findByIdAndUpdate(releaseId, updatedRelease, (err, data) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Internal Server Error",
              errorMessage: err.message,
            });
          } else if (data) {
            Logger.debug(data)
            return res.status(200).send();
          }
        })
    }
   })
  } catch (err) {
    Logger.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
}

const updateReleaseById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    if(!req.params.releaseId){
      return res.status(300).json({
        message: "release id not found",
      });
    }

    const releaseId = req.params.releaseId;
    const releaseModel = db.model("release", ReleaseSchema);
    const releaseBody = req.body;

    releaseModel.findByIdAndUpdate(releaseId, releaseBody, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          errorMessage: err.message,
        });
      } else if (data) {
        return res.status(200).send();
      }
    });

  } catch (err) {
    Logger.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
}


const addTasksToRelease = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      return res.status(400).json({
        message: "DB client not found",
      });
    }

    const releaseId = req.params.releaseId;
    const releaseBody = req.body;
    const releaseModel = db.model("release", ReleaseSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    // data structure of releaseBody
    /**
     *  const milestonesList = {
    [milestontId]: {
      name: "miestone name",
      selected: false,
      tasks: {
        [taskId]: {
          name: "task_name",
          selected: false,
        },
      },
    },
    };
     */

    const milestoneIds = [];
    const taskIds = [];

    Object.entries(releaseBody).forEach(([key, value]) => {
      milestoneIds.push(key);
      if (value.tasks) {
        Object.entries(value.tasks).forEach(([key, value]) => {
          // take only the task Ids which are selected
          if (value.selected) {
            taskIds.push(key);
          }
        });
      }
    });

    releaseModel.findOneAndUpdate(
      { _id: releaseId },
      {
        $addToSet: {
          milestones: {
            $each: milestoneIds,
          },
          tasks: {
            $each: taskIds,
          },
        },
      },
      (err, data) => {
        if (err) {
          Logger.error(err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errorMessage: err.message,
          });
        } else {
          //   Logger.debug("updated data: ", data);
          console.log("updated data: ", data);

          milestoneModel.updateMany(
            { _id: { $in: milestoneIds } },
            {
              $push: {
                releaseInfo: {
                  $each: [
                    {
                      releaseName: data.name,
                      releaseDate: data.releaseDate,
                      releaseId: releaseId,
                    },
                  ],
                  $position: 0,
                },
              },
            },
            { multi: true, upsert: true, new: true },
            (err, doc) => {
              if (err) {
                Logger.error(err);
                return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
                  errorMessage: err.message,
                });
              } else {
                Logger.debug("release updated in milestone: ", doc);
              }
            }
          );

          taskModel.updateMany(
            { _id: { $in: taskIds } },
            {
              $set: {
                releaseInfo: {
                  releaseName: data.name,
                  releaseDate: data.releaseDate,
                  releaseId,
                },
              },
            },
            { multi: true, upsert: true, new: true },
            (err, doc) => {
              if (err) {
                Logger.error(err);
                return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
                  errorMessage: err.message,
                });
              } else {
                Logger.debug("release updated in task: ", doc);
              }
            }
          );

          return res.status(200).send();
        }
      }
    );
  } catch (err) {
    Logger.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const deleteRelease = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      return res.status(400).json({
        message: "DB client not found",
      });
    }


    const releaseId = req.params.releaseId;
    const releaseModel = db.model("release", ReleaseSchema);

    releaseModel.deleteOne({ _id: releaseId }, (err, data) => {
      if (err) {
        Logger.info(`release delete error: ${JSON.stringify(err)}`)

        return res.status(500).json({
          success: false,
          message: "Release delete failed",
        });
      } else {
        res.status(200).send();
      }
    })

  }catch(err){
    Logger.info(`delete release error: ${JSON.stringify(err)}`)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getReleases,
  createNewRelease,
  getReleaseById,
  addTasksToRelease,
  deleteTaskFromRelease,
  updateReleaseById,
  deleteRelease
};
