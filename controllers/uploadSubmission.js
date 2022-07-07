const multer = require("multer");
const sharp = require("sharp");
const { DateTime } = require("luxon");
const { uploadRiderSubmittedImage, uploadSampleImage } = require('../controllers/s3');
const { logger } = require('../controllers/logger');

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

const uploadMultiple = upload.fields([
  { name: 'input-primary', maxCount: 1 }, 
  { name: 'input-optional', maxCount: 1 }, 
  { name: 'sampleImageFile', maxCount: 1 }
]);

const uploadImages = (req, res, next) => {
  uploadMultiple(req, res, err => {
    if (err) {
      console.log("uploadMultiple errored:" + err);
      return res.send(err);
    }
    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return;

  const riderFlagNumber = req.user.FlagNumber;
  const MemorialID = req.body.MemorialCode;
  const currentTimestamp = DateTime.now().toMillis(); // Appends the unix timestamp to the file to avoid overwriting.
  const primaryFilename = `${riderFlagNumber}-${MemorialID}-${currentTimestamp}-1.jpg`;
  const optionalFilename = `${riderFlagNumber}-${MemorialID}-${currentTimestamp}-2.jpg`;

  req.body.images = [];

  // Shrink and save the primary image
  try {
    const primaryImageFileData = req.files['input-primary'][0].buffer;
    shrinkImage(primaryFilename, primaryImageFileData);
    req.body.images.unshift(primaryFilename);
  } catch (err) {
    logger.error("Error shrinking primary image: " + err);
  }
  // Handle optional image if present
  if(req.files['input-optional']) {
    try {
      const optionalImageFile = req.files['input-optional'][0].buffer;
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

const handleSampleImage = async (req, res, next) => {
  if (!req.files) return;
  
  const sampleImageFileName = req.body.EditSampleImageName

  if(req.files['sampleImageFile']) {
    try {
      const sampleImageFileData = req.files['sampleImageFile'][0].buffer;
      shrinkSampleImage(sampleImageFileName, sampleImageFileData);
    } catch (err) {
      logger.error("Error shrinking sample image: " + err);
    }
  }
  // Move on to the next task
  next();
}

async function shrinkImage(fileName, file) {
  try {
    await sharp(file)
      .resize(1440, 1440, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .withMetadata()
      .toFormat("jpeg")
      .jpeg()
      .toBuffer()
      .then(resizedImage => uploadToS3(fileName, resizedImage))
  } catch (err) {
    console.log("shrinkImage failed. " + err);
  }
}

async function uploadToS3(fileName, file) {
  try {
    const s3result = await uploadRiderSubmittedImage(fileName, file);
  } catch (err){
    console.log("S3 Rider Image Upload Failed: " + err);
  }
}

async function shrinkSampleImage(fileName, file) {
  try {
    await sharp(file)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toBuffer()
      .then(resizedImage => uploadSampleImageToS3(fileName, resizedImage))
  } catch (err) {
    console.log("shrinkImage failed. " + err);
  }
}

async function uploadSampleImageToS3(fileName, file) {
  try {
    const s3result = await uploadSampleImage(fileName, file);
    logger.info("Sample Image Uploaded: " + s3result);
    console.log(s3result);
  } catch (err){
    logger.error("S3 Sample Image Upload Failed: " + err);
  }
}

module.exports = {
  uploadImages: uploadImages,
  resizeImages: resizeImages,
  getResult: getResult,
  handleSampleImage: handleSampleImage
};
