const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect('votre_uri_mongodb', { useNewUrlParser: true, useUnifiedTopology: true });

const Photo = mongoose.model('Photo', new mongoose.Schema({
    filename: String,
    path: String
}));

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.array('photos'), async (req, res) => {
    try {
        for (let file of req.files) {
            const photo = new Photo({
                filename: file.filename,
                path: file.path
            });
            await photo.save();
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/photos', async (req, res) => {
    try {
        const photos = await Photo.find();
        res.json(photos.map(photo => ({
            url: `/uploads/${photo.filename}`
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
