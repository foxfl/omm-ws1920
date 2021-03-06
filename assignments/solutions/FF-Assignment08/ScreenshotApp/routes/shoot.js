/**
 * Created by Tobi on 03.12.15.
 * Updated on 15.12.16
 */
var express = require("express");
var router = express.Router();
var webshot = require("webshot");
var path = require("path");
var fs = require("fs");
var auth = require("./auth");
/**
 * defines the routes for the entire module (root), retrieving screenshots (retrieve) and creating screenshots (create)
 *
 * @type {{root: string, retrieve: string, create: string}}
 */
const routes = {
  root: "/",
  retrieve: "/screenshots",
  create: "/screenshots/create"
};

// where is the directory that should hold the screenshots? (relative to the module!)
const shootRootDirectory = "../shoot";

// define where we want to put the screenshots (png files).
const screenshotsDirectory = path.join(
  __dirname,
  shootRootDirectory,
  routes.retrieve
);

// first, make sure that the directory exists.
if (!fs.existsSync(screenshotsDirectory)) {
  fs.mkdirSync(screenshotsDirectory);
}

// renders the public directory as configured in shootRootDirectory

router.checkUser = function(req, res, next) {
  const { passport: { user } = {} } = req.session || {};

  if (req.originalUrl.match(/\.(png|jpg)$/i)) {
    const paths = req.originalUrl.split("/");
    // Dirty :P
    const requestedUser = paths[3];
    if (Number(requestedUser) === Number(user)) {
      next();
    } else {
      var err = new Error("Not Found");
      err.status = 404;
      next(err);
    }
  } else {
    next();
  }
};
router.use(routes.root, [
  auth.ensureAuthenticated,
  router.checkUser,
  express.static(path.join(__dirname, shootRootDirectory))
]);

const makeUserDirectory = (userId) => `${screenshotsDirectory}/${userId}`;

const checkUserDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
};

/**
 * POST to this url ('/screenshots/create') generates a screenshot file and responds with its relative path.
 * example response
 * {
 *    "status": "ok"
 *    "message": "created new screenshot",
 *    "path": "/shoot/screenshots/wwwnpmjscompackagewebshot.png",
 *    "responseTime": 5633
 * }
 * if there was an error, the response also contains a "reason" property.
 */

router.get(routes.create, function(req, res) {
  // performance metrics.
  var startTime = Date.now(),
    elapsedMilliseconds;
  var targetURL = req.query.url || "";
  // the regex strips the "https", dots and slashes from the targetURL
  var fileName = targetURL.replace(/(^http[s]?:\/\/)|[.\/\\]/gi, "") + ".png";
  // screenshot output path = full file path.

  // tell the client where the file lies.

  var responseJSON = {
    status: "ok"
  };
  const { passport: { user } = {} } = req.session || {};
  const userPath = makeUserDirectory(user);
  checkUserDirectory(userPath);

  var responsePath =
    req.baseUrl + routes.retrieve + "/" + user + "/" + fileName;

  var output = path.join(userPath, fileName);
  if (targetURL != "") {
    // parameter set correctly.
    // check if the file is already available:
    fs.stat(output, function(e, stat) {
      if (!e && stat.isFile()) {
        elapsedMilliseconds = Date.now() - startTime;
        responseJSON.message = "re-used screenshot";
        responseJSON.path = responsePath;
        responseJSON.responseTime = elapsedMilliseconds;
        res.json(responseJSON);
      } else {
        // the file is not available, yet.
        // so we have to make the expensive call to webshot()
        webshot(targetURL, output, function(err) {
          if (!err) {
            // all good.
            // the path can be used on the client to fetch the image.
            responseJSON.path = responsePath;
            responseJSON.message = "created new screenshot";
          } else {
            // politely handle errors.
            responseJSON.status = "error";
            responseJSON.message = "could not create screenshot";
            responseJSON.reason = err.toString();
          }
          elapsedMilliseconds = Date.now() - startTime;
          responseJSON.responseTime = elapsedMilliseconds;

          // send the response here.
          res.json(responseJSON);
        });
      }
    });
  } else {
    // the request was made without the "url" query parameter.
    res.json({
      status: "error",
      message: "missing parameter",
      reason: 'Parameter "url" missing.',
      responseTime: Date.now() - startTime
    });
  }
});

module.exports = router;
