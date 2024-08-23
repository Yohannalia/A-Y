const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
