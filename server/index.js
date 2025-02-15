const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5500;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'client/assets')));

// Todo: Add middleware for authentication

app.get('/', (req, res) => {


    res.sendFile(path.join(__dirname, '../client/pages/home/index.html'));
});


// Serve all folders of the 'client' directory as url paths
const pagesDir = path.join(__dirname, '../client/pages');
fs.readdir(pagesDir, (err, folders) => {
    if (err) {
         console.error('Unable to read pages directory:', err);
        return;
    }
    folders.forEach(folder => {
        const folderPath = path.join(pagesDir, folder);
        if (fs.lstatSync(folderPath).isDirectory()) {
            app.use(`/${folder}`, express.static(folderPath));


            // conditionally serve a nest folder 'modal' if it exists
            const modalDir = path.join(folderPath, 'modal');
            if (fs.existsSync(modalDir)) {
                app.use(`/${folder}/modal`, express.static(modalDir));
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});