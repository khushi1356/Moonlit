const Gallery = require('../models/Gallery');

exports.addImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const newImage = await Gallery.create({
            imageUrl: req.file.path, // Cloudinary provides the URL in req.file.path
            caption: req.body.caption,
            category: req.body.category
        });

        res.status(201).json({ success: true, data: newImage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getGallery = async (req, res) => {
    try {
        const images = await Gallery.find();
        res.status(200).json({ success: true, count: images.length, data: images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Image deleted from gallery' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};