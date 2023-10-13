const sprintDbConnect = require("../../db/sprintDb.connect");
const { BacklogSchema } = require("../../Schemas/Backlog/Backlog.schema");
const Logger = require("../../utils/logger");

const createNewBacklog = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogModel = db.model("backlog", BacklogSchema);

    const newBacklogToSave = new backlogModel(req.body);

    newBacklogToSave.save((err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error in creating backlog",
          errorMessage: err.message,
        });
      } else if (data) {
        return res.status(201).send();
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getBacklogById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const backlogModel = db.model("backlog", BacklogSchema);

    backlogModel.findOne({ _id: backlogId }, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error in getting backlog",
          errorMessage: err.message,
        });
      } else if (data) {
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

const getAllBacklogs = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogModel = db.model("backlog", BacklogSchema);

    backlogModel.find({}, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          errorMessage: err.message,
        });
      } else if (data) {
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

const updateBacklog = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const backlogModel = db.model("backlog", BacklogSchema);
    const updatedContent = req.body;

    backlogModel.findByIdAndUpdate(backlogId, updatedContent, (err, data) => {
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
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteBacklog = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const backlogModel = db.model("backlog", BacklogSchema);

    backlogModel.deleteOne({ _id: backlogId }, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error in deleting backlog",
          errorMessage: err.message,
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

const addComment = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const backlogModel = db.model("backlog", BacklogSchema);

    const commentToAdd = req.body;

    backlogModel.update(
      { _id: backlogId },
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

const getAllComments = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const backlogModel = db.model("backlog", BacklogSchema);

    backlogModel
      .findOne({ _id: backlogId })
      .select("comments -_id")
      .exec((err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
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

const getCommentById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const commentId = req.params.commentId;
    const backlogModel = db.model("backlog", BacklogSchema);

    backlogModel.findOne({ _id: backlogId }, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      } else {
        Logger.debug("backlog data: ", data);
        data.comments.id(commentId, (err, data) => {
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
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
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

    const backlogId = req.params.backlogId;
    const commentId = req.params.commentId;
    const backlogModel = db.model("backlog", BacklogSchema);

    const backlogToUpdate = await backlogModel.findOne({ _id: backlogId });

    const { editedByEmail, message } = req.body;

    const commentToEdit = backlogToUpdate.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (commentToEdit.ownerEmail === editedByEmail) {
      backlogToUpdate.comments = backlogToUpdate.comments.map((comment) =>
        comment._id.toString() === commentId ? { ...comment, message } : comment
      );
      backlogToUpdate.save((err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error in updating backlog",
            errorMessage: err.message,
          });
        } else {
          return res.status(200).send();
        }
      });
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

    const backlogId = req.params.backlogId;
    const commentId = req.params.commentId;
    const backlogModel = db.model("backlog", BacklogSchema);

    const backlogToUpdate = await backlogModel.findOne({ _id: backlogId });

    const { deletedByEmail } = req.body;

    const commentToDelete = backlogToUpdate.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (commentToDelete.ownerEmail === deletedByEmail) {
      backlogToUpdate.comments = backlogToUpdate.comments.filter(
        (comment) => comment._id.toString() !== commentId
      );
      backlogToUpdate.save((err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        } else {
          return res.status(200).send();
        }
      });
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

const addAttachment = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const backlogModel = db.model("backlog", BacklogSchema);
    const attachmentToAdd = req.body;

    if (attachmentToAdd.owner && attachmentToAdd.ownerEmail) {
      backlogModel.updateOne(
        { _id: backlogId },
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

const getAttachmentsInBacklog = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const backlogModel = db.model("backlog", BacklogSchema);

    const attachments = await backlogModel
      .findOne({ _id: backlogId })
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

    const backlogId = req.params.backlogId;
    const attachmentId = req.params.attachmentId;
    const backlogModel = db.model("backlog", BacklogSchema);

    backlogModel.findOne(
      { _id: backlogId, "attachments._id": attachmentId },
      (err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error getting attachment",
            errorMessage: err.message,
          });
        } else {
          return res.status(200).json({
            success: true,
            data,
          });
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

const updateAttachmentBydId = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });
      return;
    }

    const backlogId = req.params.backlogId;
    const attachmentId = req.params.attachmentId;
    const backlogModel = db.model("backlog", BacklogSchema);

    const backlogToUpdate = await backlogModel.findOne({ _id: backlogId });

    const { editedByEmail } = req.body;

    const attachmentToEdit = backlogToUpdate.attachments.find(
      (attachment) => attachment._id.toString() === attachmentId
    );

    if (attachmentToEdit.ownerEmail === editedByEmail) {
      backlogToUpdate.attachments = backlogToUpdate.attachments.map(
        (attachment) => {
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
        }
      );

      backlogToUpdate.save((err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error in updating attachment",
            errorMessage: err.message,
          });
        } else {
          return res.status(200).send();
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Update not allowed",
      });
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

    const backlogId = req.params.backlogId;
    const attachmentId = req.params.attachmentId;
    const backlogModel = db.model("backlog", BacklogSchema);

    const backlogToDelete = await backlogModel.findOne({ _id: backlogId });

    const { deletedByEmail } = req.body;

    const attachmentToDelete = backlogToDelete.attachments.find(
      (attachment) => attachment._id.toString() === attachmentId
    );

    if (attachmentToDelete.ownerEmail === deletedByEmail) {
      backlogToDelete.attachments = backlogToDelete.attachments.filter(
        (attachment) => attachment._id.toString() !== attachmentId
      );
      backlogToDelete.save((err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error in deleting attachment",
            errorMessage: err.message,
          });
        } else {
          return res.status(200).send();
        }
      });
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
  createNewBacklog,
  getBacklogById,
  getAllBacklogs,
  deleteBacklog,
  updateBacklog,
  addComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  addAttachment,
  getAttachmentsInBacklog,
  getAttachmentById,
  updateAttachmentBydId,
  deleteAttachment
};
