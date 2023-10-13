const { SprintSchema } = require("../../Schemas/Sprint/Sprint.schema");
const { MilestoneSchema } = require("../../Schemas/Sprint/Milestone.schema");
const { TaskSchema } = require("../../Schemas/Sprint/Task.schema");
const { BacklogSchema } = require("../../Schemas/Backlog/Backlog.schema");
const sprintDbConnect = require("../../db/sprintDb.connect");
const Logger = require("../../utils/logger");

const createNewTask = async (req, res) => {
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
    const taskModel = db.model("task", TaskSchema);

    const newtaskToSave = taskModel(req.body);
    const savedtaskData = await newtaskToSave.save();

    const milestoneToUpdate = await milestoneModel.findOne({
      _id: milestoneId,
    });

    if (milestoneToUpdate.tasks) {
      milestoneToUpdate.tasks.push(savedtaskData._id);
    } else {
      milestoneToUpdate.tasks = [savedtaskData._id];
    }

    await milestoneToUpdate.save();

    return res.status(201).json({
      success: true,
      message: "Task created",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const addSubTask = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const parentTaskId = req.params.taskId;
    const taskModel = db.model("task", TaskSchema);

    const newtaskToSave = taskModel({
      ...(req.body),
      parentTaskId
    });
    const savedtaskData = await newtaskToSave.save();

    const taskToUpdate = await taskModel.findById(parentTaskId)
    
    if(taskToUpdate.subTasks){
      taskToUpdate.subTasks.push(savedtaskData._id)
    } else {
      taskToUpdate.subTasks = [savedtaskData._id]
    }

    await taskToUpdate.save();

    return res.status(201).json({
      success: true,
      message: "Task created",
    });

  }catch(err){
    Logger.error(`addSubTask err: ${JSON.stringify(err)}`)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    })
  }
};

const multipleTasksTransfer = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
        res.status(400).json({
            message: "DB client not found",
        });
        return;
    }   

    const currentMilestoneId = req.params.milestoneId;
    const selectedMilestoneId = req.params.selectedMilestoneId;

    const taskIdList = req.body.taskIdList

    console.log(taskIdList, "TASK ID LIST");

    const milestoneModel = db.model("milestone", MilestoneSchema);

    milestoneModel.updateOne(
      { _id: selectedMilestoneId },
      {
          $push: {
              tasks: {$each: taskIdList},
          },
      },
      (err, data) => {
          if (err) {
              Logger.error(err);
              return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
              });
          } else {
              Logger.debug(data);
              // return res.status(200).send();
              milestoneModel.updateOne(
                { _id: currentMilestoneId },
                {
                    $pullAll: {
                        tasks: taskIdList,
                    },
                },
                {upsert: true},
                (err, data) => {
                    if (err) {
                        Logger.error(err);
                        return res.status(500).json({
                            success: false,
                            message: "Internal Server Error",
                        });
                    } else {
                        Logger.debug(data);
                        return res.status(200).send();
                    }
                }
            );
          }
      }
  )

} catch (err) {
  Logger.error(err);
  res.status(500).json({
      success: false,
      message: "Internal Server Error",
  });
}
}

const taskTransfer = async (req, res) => {
    try {
        let db = await sprintDbConnect();
        if (!db) {
            res.status(400).json({
                message: "DB client not found",
            });
            return;
        }   

        const taskId = req.params.taskId;
        const currentMilestoneId = req.params.milestoneId;
        const selectedMilestoneId = req.params.selectedMilestoneId;
        // const selectedMilestoneId = '63dccc20941d75ac5eb592e4';
        
        const milestoneModel = db.model("milestone", MilestoneSchema);

        const isTaskPresent = await milestoneModel.findOne({
            _id: selectedMilestoneId,
            tasks: { $in: [taskId] },
        });

        if (!isTaskPresent && currentMilestoneId !== selectedMilestoneId) {
            milestoneModel.updateOne(
                { _id: selectedMilestoneId },
                {
                    $push: {
                        tasks: taskId,
                    },
                },
                (err, data) => {
                    if (err) {
                        Logger.error(err);
                        return res.status(500).json({
                            success: false,
                            message: "Internal Server Error",
                        });
                    } else {
                        Logger.debug(data);
                        // return res.status(200).send();
                        milestoneModel.updateOne(
                          { _id: currentMilestoneId },
                          {
                              $pull: {
                                  tasks: taskId,
                              },
                          },
                          (err, data) => {
                              if (err) {
                                  Logger.error(err);
                                  return res.status(500).json({
                                      success: false,
                                      message: "Internal Server Error",
                                  });
                              } else {
                                  Logger.debug(data);
                                  return res.status(200).send();
                              }
                          }
                      );
                    }
                }
            )
        }else{
          return res.status(400).json({
            success: false,
            message: "Task already present in milestone.",
        });
        }

    } catch (err) {
        Logger.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const getTasksInMilestone = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const status = req.query.status;
    const milestoneId = req.params.milestoneId;
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    if (status) {
      const taskData = await milestoneModel
        .findOne({ _id: milestoneId })
        .select("tasks -_id")
        .populate({ path: "tasks", taskModel });

      const filteredTaskData = taskData.tasks.filter(
        (task) => task.status === status.trim().toUpperCase()
      );

      return res.status(200).json({
        success: true,
        data: filteredTaskData,
      });
    } else {
      const taskData = await milestoneModel
        .findOne({ _id: milestoneId })
        .select("tasks -_id")
        .populate({ path: "tasks", taskModel });

      return res.status(200).json({
        success: true,
        data: taskData,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errormessage: err.message,
      error: err,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const milestoneId = req.params.milestoneId;
    const taskModel = db.model("task", TaskSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);

    const isTaskPresent = await milestoneModel.findOne({
      _id: milestoneId,
      tasks: taskId,
    });

    if (isTaskPresent) {
      const data = await taskModel.findOne({ _id: taskId }).populate({
        path: "subTasks",
        model: taskModel,
      })

      return res.status(200).json({
        success: true,
        data
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Task not found in milestone",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const dataToUpdate = req.body;
    const taskId = req.params.taskId;
    const milestoneId = req.params.milestoneId;
    const sprintId = req.params.sprintId;
    const taskModel = db.model("task", TaskSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);

    const isTaskPresent = await milestoneModel.findOne({
      _id: milestoneId,
      tasks: taskId,
    });

    const isSubTaskPresent = await taskModel.findOne({
      "tasks.subTasks": taskId
    })

    if (isTaskPresent || isSubTaskPresent) {
      const { worklog, status } = dataToUpdate;

      delete dataToUpdate.worklog;
      taskModel.updateOne({ _id: taskId }, dataToUpdate, async (err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        } else {
          const taskToUpdate = await taskModel.findOne({ _id: taskId });
          const existingWorklog = Object.fromEntries(taskToUpdate.worklog);

          if (worklog) {
            Object.keys(existingWorklog).forEach((day) => {
              if (typeof worklog[day] === "number" && worklog[day] >= 0) {
                taskToUpdate.worklog.set(day, worklog[day]);
              } else {
                const oldData = taskToUpdate.worklog.get(day);
                taskToUpdate.worklog.set(day, oldData);
              }
            });
            // here calculate the total effort spent and save it
            const updatedWorklog = {
              ...existingWorklog,
              ...worklog,
            };
            const totalEffort = Object.keys(updatedWorklog).reduce(
              (acc, curr) => acc + updatedWorklog[curr],
              0
            );
            taskToUpdate.effortSpent = totalEffort;

            try {
              await taskToUpdate.save();
            } catch (err) {
              res.status(500).json({
                success: false,
                message: "Internal Server Error",
                errorMessage: err.message,
              });
            }
          }
        }
      });

      if (status) {
        const allTaskStatusInMilestone = await milestoneModel
          .findOne({ _id: milestoneId })
          .select("tasks -_id")
          .populate({
            path: "tasks",
            model: taskModel,
            select: "status -_id",
          });
        Logger.debug("all task status: ", allTaskStatusInMilestone);

        const doneTaskCount = allTaskStatusInMilestone.tasks.reduce(
          (acc, curr) => (curr.status === "DONE" ? acc + 1 : acc),
          0
        );
        await milestoneModel.updateOne(
          { _id: milestoneId },
          { tasksDoneCount: doneTaskCount }
        );
      }
    }

    res.status(200).send();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const deleteTaskById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const milestoneId = req.params.milestoneId;
    const taskId = req.params.taskId;
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    const milestoneToUpdate = await milestoneModel.findOne({
      _id: milestoneId,
      tasks: taskId,
    });

    if (milestoneToUpdate) {
      milestoneToUpdate.tasks = milestoneToUpdate.tasks.filter(
        (id) => id.toString() !== taskId
      );

      await milestoneToUpdate.save();
      const allTaskStatusInMilestone = await milestoneModel
        .findOne({ _id: milestoneId })
        .select("tasks -_id")
        .populate({
          path: "tasks",
          model: taskModel,
          select: "status -_id",
        });

      const doneTaskCount = allTaskStatusInMilestone.tasks.reduce(
        (acc, curr) => (curr.status === "DONE" ? acc + 1 : acc),
        0
      );
      await milestoneModel.updateOne(
        { _id: milestoneId },
        { tasksDoneCount: doneTaskCount }
      );
      await taskModel.deleteOne({ _id: taskId });

      res.status(200).send();
    } else {
      return res.status(404).json({
        success: false,
        message: "Task not found in milestone",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const deleteSubTaskById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const milestoneId = req.params.milestoneId;
    const taskId = req.params.taskId;
    const subTaskId = req.params.subTaskId;
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const taskModel = db.model("task", TaskSchema);

    const taskToUpdate = await taskModel.findOne({
      _id: taskId,
      subTasks: subTaskId
    })

    if(taskToUpdate){
      taskToUpdate.subTasks = taskToUpdate.subTasks.filter((id) => id.toString() !== subTaskId)
      await taskToUpdate.save()

      await taskModel.deleteOne({ _id: subTaskId });

      res.status(200).send();
    }
    else {
      return res.status(404).json({
        success: false,
        message: "SubTask not found in task",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const moveTaskTobacklog = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const milestoneId = req.params.milestoneId;
    const sprintId = req.params.sprintId;
    const taskModel = db.model("task", TaskSchema);
    const milestoneModel = db.model("milestone", MilestoneSchema);
    const backlogModel = db.model("backlog", BacklogSchema);

    const isTaskPresent = await milestoneModel.findOne({
      _id: milestoneId,
      tasks: taskId,
    });

    if (isTaskPresent) {
      const task = await taskModel
        .findById(taskId)
        .select("name summary description comments attachments -_id");
      
      const newBacklogToSave = new backlogModel({
        ...(task._doc),
        type: "BACKLOG",
        status: "BACKLOG",
      });

      newBacklogToSave.save((err, data) => {
        if (err) {
          Logger.error(err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errorMessage: err.message,
          });
        }else {
          milestoneModel.updateOne({ _id: milestoneId }, {
            $pull: {
              tasks: taskId
            }
          }, (err, data) => {
            if(err){
              Logger.error(err)
              return res.status(500).json({
                success: false,
                message: "Internal Server Error"
              })
            }else {
              Logger.debug(data)
              return res.status(200).send()
            }
          })
        }
      });
      Logger.debug(task);
    }

    return res.status(200).send();
  } catch (err) {
    Logger.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createNewTask,
  taskTransfer,
  getTasksInMilestone,
  getTaskById,
  deleteTaskById,
  updateTask,
  moveTaskTobacklog,
  multipleTasksTransfer,
  addSubTask,
  deleteSubTaskById
};
