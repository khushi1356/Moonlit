const Category = require('../models/Category');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Category image is required' });
        }

        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Category with this name already exists' });
        }

        const category = await Category.create({
            name,
            description,
            image: req.file.path // Cloudinary URL
        });

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        await category.deleteOne();
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};