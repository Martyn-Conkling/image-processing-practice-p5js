const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // Port number for the server

// Directory containing images. Adjust the path as necessary.
const imagesDirectory = path.join(__dirname, '../images');

app.use(cors());
// Route to list images
app.get('/list-images', (req, res) => {
    fs.readdir(imagesDirectory, (err, files) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error reading the images directory.');
            return;
        }
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        let imagePathAndNameData = {imagePaths:[], imageNames:[]};
        imagePathAndNameData.imagePaths = imageFiles.map(file => `/images/${file}`);
        imagePathAndNameData.imageNames = imageFiles.map(file => {
            let fileNameString = `${file}`
            let modName = fileNameString.substring(0, fileNameString.length - 4)
            return modName;
        }
        
        );
        res.json(imagePathAndNameData);
    });
});

// Static files middleware
// app.use('/images', express.static(imagesDirectory));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
