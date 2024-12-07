const jsonServer = require('json-server');
const multer = require('multer');
const path = require('path');
const express = require('express'); 

// Create a custom Express server
const instaServer = jsonServer.create();

// Set up file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamped name
  }
});

const upload = multer({ storage });

// Middleware
const middleware = jsonServer.defaults();
const router = jsonServer.router('db.json');

instaServer.use(middleware);

// Serve static files from the 'uploads' folder
instaServer.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle the image upload
instaServer.post('/post', upload.single('image'), (req, res, next) => {
  // If file is uploaded successfully
  if (req.file) {
    console.log('File uploaded:', req.file);
    req.body.image = req.file.path; // Save the file path in the post object
  } else {
    console.log('No file uploaded.');
  }

  // Continue processing request to JSON Server
  next();
});

// Use the JSON Server router to handle other requests
instaServer.use(router);

const PORT = 4000;
instaServer.listen(PORT, () => {
  console.log(`Server is running at port number ${PORT}`);
});
