const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Set up AWS credentials and region
AWS.config.update({
  accessKeyId: 'AKIA37VXUPBVRFBSHJJB',
  secretAccessKey: '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',
});

// Create an S3 object
const s3 = new AWS.S3();

// Set up multer storage for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create an express app
const app = express();

// Serve the HTML page with the upload form and button
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Image Upload</title>
      </head>
      <body>
        <h1>Image Upload</h1>
        <form method="POST" enctype="multipart/form-data">
          <input type="file" name="image" />
          <button type="submit">Upload</button>
        </form>
      </body>
    </html>
  `);
});

// Handle the image upload
app.post('/', upload.single('image'), (req, res) => {
  const bucketName = 'nodes3v';
  const objectKey = path.basename(req.file.originalname);
  const uploadParams = {
    Bucket: bucketName,
    Key: objectKey,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.log('Error uploading mage:', err);
      res.send('Error uploading image');
    } else {
      console.log('Image uploaded successfully to:', data.Location);
      res.send(`Image uploaded successfully to <a href="${data.Location}">${data.Location}</a>`);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening port 3000');
});