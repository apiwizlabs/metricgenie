const jwt = require("jsonwebtoken");
const config = require("../config");
const sprintDbConnect = require("../db/sprintDb.connect");
const { UserSchema } = require("../Schemas/user.schema");
const { OAuth2Client } = require("google-auth-library");
const Logger = require("../utils/logger");

async function verify(token) {
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email_verified, email, name, hd } = payload;

    if (email_verified && ( hd === "itorix.com" || hd === "apiwiz.com")) {
      return {
        verified: true,
        email,
        name,
        hd,
      };
    } else {
      return {
        verified: false,
      };
    }
  } catch (err) {
    Logger.error("Error in verifying user: ", err.message);
    return {
      verified: false,
    };
  }
}

const loginController = async (req, res) => {
  try {
    const loginObj = req.body;
    const { verified, email, name } = await verify(loginObj.token);

    if (verified) {
      let db = await sprintDbConnect();
      if (!db) {
        res.status(400).json({
          message: "DB client not found",
        });

        return;
      }

      const userListModel = db.model("users.list", UserSchema);

      const emailUserName = email.split("@")[0]

      const itorixEmail = emailUserName + "@itorix.com"

      const isUserPresent = await userListModel.findOne({ $or: [{ email: email }, {email: itorixEmail }] });
      if (isUserPresent) {
        userListModel.findByIdAndUpdate(
          isUserPresent._id.toString(),
          {
            lastLogin: Date.now(),
          },
          (err, data) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Error in loggin in",
                errorMessage: err.message
              });
            } else if (data) {
              return res.status(200).json({
                success: true,
                data: {
                  token: jwt.sign({ email, name }, config.JWT_SECRET, {
                    expiresIn: config.TOKEN_EXPIRY,
                  }),
                },
              });
            }
          }
        );
      } else {
        const userToSave = new userListModel({ name, email });
        userToSave.save((err, data) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error in registering user",
              errorMessage: err.message,
            });
          }
          if (data) {
            return res.status(200).json({
              success: true,
              data: {
                token: jwt.sign({ email, name }, config.JWT_SECRET, {
                  expiresIn: config.TOKEN_EXPIRY,
                }),
              },
            });
          }
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "User cannot be verified",
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

module.exports = { loginController };
