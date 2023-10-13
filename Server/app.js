const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const errorhandler = require("./middlewares/errorHandler");
const routeNotFoundHandlers = require("./middlewares/routeNotFoundHandler");
const connectToDb = require("./db/db.connect");
const { normalizePort } = require("./helpers");
const { checkAuthentication } = require("./middlewares/authentication");
const workspaceRoute = require("./routes/workspace.router");
const userRoute = require("./routes/users.router");
const downloadsRoute = require("./routes/downloads.router");
const activityRoute = require("./routes/activity.router");
const loginRoute = require("./routes/login.router");
const overallActivityRoute = require("./routes/overallActivity.router");
const sprintRoute = require("./routes/SprintPlanning/Sprint/Sprint.router");
const uploadRoute = require("./routes/fileUpload.router");
const downloadRoute = require("./routes/fileDownload.router");
const deleteFileRoute = require("./routes/fileDelete.router");
const bugsRoute = require("./routes/BugTracking/bugTracking.router");
const backlogRoute = require("./routes/Backlog/backlog.router");
const sprintUsersRoute = require("./routes/SprintUsers/users.router");
const releasesRoute = require("./routes/ReleaseTracker/Release.router");
const allMilestoneRoute = require("./routes/ReleaseTracker/Allmilestones.router");
const morgan = require("morgan");
const morganMiddleware = require("./utils/morganMiddleware");

const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const config = require("./config");
const logger = require("./utils/logger")

global.logger = logger

morgan.token('id', function getId (req) {
  return req.id
})

const assignId = (req, res, next) => {
  req.id = uuidv4()
  next()
}



const app = express();
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    name: config.COOKIE_KEY,
  })
);
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(assignId)
app.use(morganMiddleware)

// root route
app.get("/", (req, res) => {
  res.send("response from root route");
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
  req.session.destroy();
  res.send("Good bye");
});

// use all routes here
app.use("/login", loginRoute);
app.use("/workspace", workspaceRoute);
app.use("/users", userRoute);
app.use("/downloads", downloadsRoute);
app.use("/activity/workspace", activityRoute);
app.use("/activity/overall", overallActivityRoute);
app.use("/v1/sprints", sprintRoute);
app.use("/v1/upload", uploadRoute);
app.use("/v1/view", downloadRoute);
app.use("v1/delete", deleteFileRoute);
app.use("/v1/bugs", bugsRoute);
app.use("/v1/backlog", backlogRoute);
app.use("/v1/sprintusers", sprintUsersRoute);
app.use("/v1/releases", releasesRoute);
app.use("/v1/milestones/all", allMilestoneRoute);

//error handler middlewares
app.use(routeNotFoundHandlers);
app.use(errorhandler);

const PORT = normalizePort(config.PORT || "3001");

app.listen(PORT, async () => {
  let db = await connectToDb("apiwiz");
  logger.info(`Server connected successfully on PORT: ${PORT}`);
});
