const multer = require("multer");
const sharp = require("sharp");
const moment = require("moment");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadFiles = upload.array("image-to-submit", 1); // limit to 1 image

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, err => {
    if (err) {
      return res.send(err);
    }
    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return;

  req.body.images = [];
  await Promise.all(
    req.files.map(async file => {
      const riderFlagNumber = req.user.FlagNumber;
      var bonusID = "";
      if (req.body.bonus_id) {
        bonusID = "GT" + req.body.bonus_id;
      } else {
        bonusID = "ODO";
      }
      const currentTimestamp = moment().unix(); // Appends the unix timestamp to the file to avoid overwriting.
      const newFilename = `${riderFlagNumber}-${bonusID}-${currentTimestamp}.jpg`;

      await sharp(file.buffer)
        // .resize(1024, 768, {
        //   position: 'left top'
        // })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`static/uploads/${newFilename}`);

      req.body.images.push(newFilename);
    })
  );
  next();
};

const getResult = async (req, res, next) => {
  if (req.body.images.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }

  const images = req.body.images
    .map(image => "" + image + "")
    .join("");

  next();
};

module.exports = {
  uploadImages: uploadImages,
  resizeImages: resizeImages,
  getResult: getResult
};