require('dotenv').config();

const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const isProd = process.env.IS_PROD;
const rallyYear = process.env.CURRENT_RALLY_YEAR;
let s3FilePath = '';

const s3 = new S3({
  region,

  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Uploads Rider Submitted Image to S3
function uploadRiderSubmittedImage(fileName, file) {
  // Set the proper filename depending on env
  if (isProd === 'true') {
    s3FilePath = `RallyImages/${rallyYear}/${fileName}`;
  } else {
    s3FilePath = `TestData/${fileName}`;
  }
  // Set up the required S3 parameter
  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    ContentType: 'image/jpeg',
    Key: s3FilePath,
  };
  // Do the upload
  return new Upload({
    client: s3,
    params: uploadParams,
  }).done();
}

// Uploads SampleImages to S3
function uploadSampleImage(fileName, file) {
  // Set the proper filename
  s3FilePath = `SampleImages/${fileName}`;
  // Set up the required S3 parameter
  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    ContentType: 'image/jpeg',
    Key: s3FilePath,
  };
  // Do the upload
  return new Upload({
    client: s3,
    params: uploadParams,
  }).done();
}

exports.uploadRiderSubmittedImage = uploadRiderSubmittedImage;
exports.uploadSampleImage = uploadSampleImage;
