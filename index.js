var screenshotAPI = require("./screenshotmachineAPI");
var driveUpload = require("./googleDriveUpload");

driveUpload.setup();
screenshotAPI.savePhotos(driveUpload.uploadItem);
