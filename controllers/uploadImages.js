const multer = require("multer");
const sharp = require("sharp");
const { DateTime } = require("luxon");

const riderFlagNumber = 714;
const BonusID = "TEST";

const currentTimestamp = DateTime.now().toMillis(); // Appends the unix timestamp to the file to avoid overwriting.
const primaryFilename = `${riderFlagNumber}-${BonusID}-${currentTimestamp}-1.jpg`;
const optionalFilename = `${riderFlagNumber}-${BonusID}-${currentTimestamp}-2.jpg`;


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, primaryFilename)
  }
});

const upload = multer({storage: storage});
var uploadMultiple = upload.fields([{ name: 'input-primary', maxCount: 1 }, { name: 'input-optional', maxCount: 1 }]);
