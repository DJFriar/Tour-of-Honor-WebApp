require('dotenv').config();

const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// Uploads to S3
function uploadFile(fileName, file) {
  const s3FilePath = "RallyImages/2022/" + fileName

  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    ContentType: "image/jpeg",
    Key: s3FilePath
  }

  return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile

// Downloads from S3
