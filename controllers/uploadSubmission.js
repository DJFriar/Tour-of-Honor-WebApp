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
  console.log(req.body);
  const riderFlagNumber = req.user.FlagNumber;
  const MemorialID = req.body.MemorialCode;
  const currentTimestamp = DateTime.now().toMillis(); // Appends the unix timestamp to the file to avoid overwriting.

  req.body.images = [];
  if(req.files['input-optional']) {
    await Promise.all(
      req.files['input-primary'].map(async file => {
        const primaryFilename = `${riderFlagNumber}-${MemorialID}-${currentTimestamp}-1.jpg`;
        await sharp(file.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`static/uploads/${primaryFilename}`);
  
        req.body.images.unshift(primaryFilename);
      }),
      req.files['input-optional'].map(async file => {
        const optionalFilename = `${riderFlagNumber}-${MemorialID}-${currentTimestamp}-2.jpg`;
        await sharp(file.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`static/uploads/${optionalFilename}`);
  
        req.body.images.push(optionalFilename);
      })
    );
  } else {
    await Promise.all(
      req.files['input-primary'].map(async file => {
        const primaryFilename = `${riderFlagNumber}-${MemorialID}-${currentTimestamp}-1.jpg`;
        await sharp(file.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`static/uploads/${primaryFilename}`);
  
        req.body.images.unshift(primaryFilename);
      })
    );
  }
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