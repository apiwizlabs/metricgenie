const { TaskSchema } = require("../../Schemas/Sprint/Task.schema");
const sprintDbConnect = require("../../db/sprintDb.connect");
const Logger = require("../../utils/logger");

const addCommentInTask = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const taskModel = db.model("task", TaskSchema);

    const commentToAdd = req.body;
    taskModel.update(
      { _id: taskId },
      {
        $push: {
          comments: commentToAdd,
        },
      },
      (err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        } else {
          return res.status(200).send();
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCommentsOfaTask = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const taskModel = db.model("task", TaskSchema);

    taskModel
      .findOne({ _id: taskId })
      .select("comments -_id")
      .exec((err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        } else {
          Logger.debug("comments data: ", data);
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

const getCommentById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const commentId = req.params.commentId;
    const taskModel = db.model("task", TaskSchema);

    taskModel.findOne({ _id: taskId }, (err, data) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      } else {
        const comment = data.comments.find(
          (comment) => comment._id.toString() === commentId
        );

        if (comment) {
          return res.status(200).json({
            success: true,
            data: comment,
          });
        } else {
          return res.status(404).send();
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const commentId = req.params.commentId;
    const taskModel = db.model("task", TaskSchema);

    const taskToUpdate = await taskModel.findOne({ _id: taskId });

    const { editedByEmail, message } = req.body;

    const commentToEdit = taskToUpdate.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (commentToEdit.ownerEmail === editedByEmail) {
      taskToUpdate.comments = taskToUpdate.comments.map((comment) =>
        comment._id.toString() === commentId ? { ...comment, message } : comment
      );
      await taskToUpdate.save();
      return res.status(200).send();
    } else {
      return res.status(500).json({
        success: false,
        message: "Edit not allowed",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const commentId = req.params.commentId;
    const taskModel = db.model("task", TaskSchema);

    const taskToUpdate = await taskModel.findOne({ _id: taskId });

    const { deletedByEmail } = req.body;

    const commentToDelete = taskToUpdate.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (commentToDelete.ownerEmail === deletedByEmail ) {
      taskToUpdate.comments = taskToUpdate.comments.filter(
        (comment) => comment._id.toString() !== commentId
      );
      await taskToUpdate.save();
      return res.status(200).send();
    } else {
      return res.status(500).json({
        success: false,
        message: "Delete not allowed",
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
  addCommentInTask,
  getCommentsOfaTask,
  getCommentById,
  updateComment,
  deleteComment
};
