const multer = require("multer");
const sharp = require("sharp");
const { DateTime } = require("luxon");

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

const uploadMultiple = upload.fields([{ name: 'input-primary', maxCount: 1 }, { name: 'input-optional', maxCount: 1 }]);

const uploadImages = (req, res, next) => {
  uploadMultiple(req, res, err => {
    if (err) {
      console.log("uploadMultiple errored");
      console.log(err);
      return res.send(err);
    }
    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return;
  console.log("==== resizeImages ====");
  console.log(req.files);
  const riderFlagNumber = req.user.FlagNumber;
  const MemorialID = req.body.MemorialCode;
  const currentTimestamp = DateTime.now().toMillis(); // Appends the unix timestamp to the file to avoid overwriting.
  const primaryFilename = `${riderFlagNumber}-${MemorialID}-${currentTimestamp}-1.jpg`;
  const optionalFilename = `${riderFlagNumber}-${MemorialID}-${currentTimestamp}-2.jpg`;
  const primaryImageFile = req.files['input-primary'][0].buffer;
  const optionalImageFile = req.files['input-optional'][0].buffer;

  req.body.images = [];

  // Shrink and save the images
  try {
    shrinkImage(primaryFilename, primaryImageFile);
    req.body.images.unshift(primaryFilename);
  } catch (err) {
    console.log("Error shrinking primary image: " + err);
  }
  // Handle optional image if present
  if(req.files['input-optional']) {
    try {
      shrinkImage(optionalFilename, optionalImageFile);
      req.body.images.push(optionalFilename);
    } catch (err) {
      console.log("Error shrinking optional image: " + err);
    }
  }
  // Move on to the next task
  next();
}

const getResult = async (req, res, next) => {
  if (req.body.images.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }
  next();
};

async function shrinkImage(fileName, file) {
  try {
    await sharp(file)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toFile(`static/uploads/${fileName}`);
  } catch (err) {
    console.log("shrinkImage failed. " + err)
  }
}

module.exports = {
  uploadImages: uploadImages,
  resizeImages: resizeImages,
  getResult: getResult
};
