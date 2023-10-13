const { BugSchema } = require("../../Schemas/Bugs/Bug.Schema");
const sprintDbConnect = require("../../db/sprintDb.connect");
const Logger = require("../../utils/logger");

const createNewBug = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const bugBody = req.body;
    const bugModel = db.model("bug", BugSchema);
    const bugToSave = new bugModel(bugBody);

    bugToSave.save((err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error creating bug",
          errorMessage: err.message,
        });
      } else if (data) {
        return res.status(201).json({
          success: true,
          message: "Bug Created",
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

const getAllBugs = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const status = req.query.status;
    const bugModel = db.model("bug", BugSchema);

    if (!status) {
      const allBugs = await bugModel.find({});

      return res.status(200).json({
        success: true,
        data: allBugs,
      });
    } else {
      const filteredBugs = await bugModel.find({
        status: status?.toUpperCase(),
      });

      if (filteredBugs) {
        return res.status(200).json({
          success: true,
          data: filteredBugs,
        });
      } else {
        res.status(404).send();
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

const getBugById = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const bugId = req.params.bugId;
    const bugModel = db.model("bug", BugSchema);

    const bug = await bugModel.findOne({ _id: bugId });

    if (bug) {
      return res.status(200).json({
        success: true,
        data: bug,
      });
    } else {
      return res.status(404).send();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

const updateBug = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const bugId = req.params.bugId;
    const updatedContent = req.body;
    const { tags } = updatedContent;
    Logger.debug("tags: ", { tags });
    console.log("tags: ", tags)
    const bugModel = db.model("bug", BugSchema);

    // if tags is there for update, then update only the fields sent, rest keep same as old

    bugModel.findByIdAndUpdate(bugId, updatedContent, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error updating bug",
        });
      } else {

        if (tags) {
          data.tags = {
            ...data.tags,
            ...tags,
          };
          data.save((err, data) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                errorMessage: err.message,
              });
            } else {
              return res.status(200).send();
            }
          });
        }else {
          return res.status(200).send();
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

const deleteBug = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const bugId = req.params.bugId;
    const bugModel = db.model("bug", BugSchema);

    bugModel.deleteOne({ _id: bugId }, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error in deletig bug",
          errorMessage: err.message,
        });
      } else {
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

const addAttachmentInBug = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const bugModel = db.model("bug", BugSchema);
    const bugId = req.params.bugId;
    const attachmentToAdd = req.body;

    if (attachmentToAdd.owner && attachmentToAdd.ownerEmail) {
      bugModel.updateOne(
        { _id: bugId },
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

const getAttachmentsInBug = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const bugModel = db.model("bug", BugSchema);
    const bugId = req.params.bugId;

    const attachments = await bugModel
      .findOne({ _id: bugId })
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

const deleteAttachmentInBug = async (req, res) => {
  try {
    let db = await sprintDbConnect();
    if (!db) {
      res.status(400).json({
        message: "DB client not found",
      });

      return;
    }

    const bugId = req.params.bugId;
    const attachmentId = req.params.attachmentId;
    const bugModel = db.model("bug", BugSchema);

    const bugToUpdate = await bugModel.findOne({ _id: bugId });

    const { deletedByEmail } = req.body;

    const attachmentToDelete = bugToUpdate.attachments.find(
      (attachment) => attachment._id.toString() === attachmentId
    );

    if (attachmentToDelete.ownerEmail === deletedByEmail) {
      bugToUpdate.attachments = bugToUpdate.attachments.filter(
        (attachment) => attachment._id.toString() !== attachmentId
      );
      await bugToUpdate.save();
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
      messgae: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

module.exports = {
  createNewBug,
  getAllBugs,
  getBugById,
  updateBug,
  deleteBug,
  addAttachmentInBug,
  getAttachmentsInBug,
  deleteAttachmentInBug,
};
