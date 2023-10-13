const { TaskSchema } = require("../../Schemas/Sprint/Task.schema");
const sprintDbConnect = require("../../db/sprintDb.connect");

const addAttachmentInTask = async (req, res) => {
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

    const attachmentToAdd = req.body;

    if (
      attachmentToAdd.owner &&
      attachmentToAdd.ownerEmail
    ) {
      taskModel.updateOne(
        { _id: taskId },
        {
          $push: {
            attachments: attachmentToAdd,
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
    } else {
      return res.status(500).json({
        success: false,
        message: "Cannot create attachment",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAttachmentsInTask = async (req, res) => {
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

    const attachments = await taskModel
      .findOne({ _id: taskId })
      .select("attachments -_id");
    if (attachments) {
      return res.status(200).json({
        success: true,
        data: attachments,
      });
    } else {
      return res.status(404).send();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAttachmentById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const attachmentId = req.params.attachmentId;
    const taskModel = db.model("task", TaskSchema);

    const attachments = await taskModel
      .findOne({ _id: taskId })
      .select("attachments -_id");

    if (attachments) {
      const attachment = attachments.attachments.find(
        (attachment) => attachment._id.toString() === attachmentId
      );
      if (attachment) {
        return res.status(200).json({
          success: true,
          data: attachment,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Attachment not found",
        });
      }
    } else {
      return res.status(500).json({
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

const updateAttachmentById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }
    const taskId = req.params.taskId;
    const attachmentId = req.params.attachmentId;
    const taskModel = db.model("task", TaskSchema);

    const taskToUpdate = await taskModel.findOne({ _id: taskId });

    const { editedByEmail } = req.body;

    const attachmentToEdit = taskToUpdate.attachments.find(
      (attachment) => attachment._id.toString() === attachmentId
    );

    if (attachmentToEdit.ownerEmail === editedByEmail) {
      taskToUpdate.attachments = taskToUpdate.attachments.map((attachment) => {
        if (attachment._id.toString() === attachmentId) {
          const contentToUpdate = req.body;
          delete contentToUpdate.editedByEmail;

          return {
            ...attachment,
            ...contentToUpdate,
          };
        } else {
          return attachment;
        }
      });

      await taskToUpdate.save();
      res.status(200).send();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteAttachment = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const taskId = req.params.taskId;
    const attachmentId = req.params.attachmentId;
    const taskModel = db.model("task", TaskSchema);

    const taskToUpdate = await taskModel.findOne({ _id: taskId });

    const { deletedByEmail } = req.body;

    const attachmentToDelete = taskToUpdate.attachments.find(
      (attachment) => attachment._id.toString() === attachmentId
    );

    if (attachmentToDelete.ownerEmail === deletedByEmail) {
      taskToUpdate.attachments = taskToUpdate.attachments.filter(
        (attachment) => attachment._id.toString() !== attachmentId
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
  addAttachmentInTask,
  getAttachmentsInTask,
  getAttachmentById,
  updateAttachmentById,
  deleteAttachment
};
