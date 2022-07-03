require('dotenv').config();

const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const isProd = process.env.isProd
let s3FilePath = ""

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// Uploads Rider Submitted Image to S3
function uploadRiderSubmittedImage(fileName, file) {
  // Set the proper filename depending on env
  if (isProd) {
    s3FilePath = "RallyImages/2022/" + fileName
  } else {
    s3FilePath = "TestData/" + fileName
  }
  // Set up the required S3 parameter
  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    ContentType: "image/jpeg",
    Key: s3FilePath
  }
  // Do the upload
  return s3.upload(uploadParams).promise()
}

// Uploads SampleImages to S3
function uploadSampleImage(fileName, file) {
  // Set the proper filename
  s3FilePath = "SampleImages/" + fileName
  // Set up the required S3 parameter
  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    ContentType: "image/jpeg",
    Key: s3FilePath
  }
  // Do the upload
  return s3.upload(uploadParams).promise()
}

exports.uploadRiderSubmittedImage = uploadRiderSubmittedImage
exports.uploadSampleImage = uploadSampleImage
