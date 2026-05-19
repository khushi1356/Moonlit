const Service = require('../models/Service');

// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
exports.createService = async (req, res) => {
    try {
        const serviceData = { ...req.body };
        
        // Auto-fill mrp if only price is provided from frontend
        if (serviceData.price && !serviceData.mrp) {
            serviceData.mrp = serviceData.price;
        } else if (serviceData.mrp && !serviceData.price) {
            serviceData.price = serviceData.mrp;
        }
        
        const existing = await Service.findOne({ name: { $regex: new RegExp(`^${serviceData.name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Service with this name already exists' });
        }

        if (req.file) {
            serviceData.image = req.file.path; // Cloudinary URL
        }

        const service = await Service.create(serviceData);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true }).populate('categoryId', 'name');
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('categoryId', 'name');
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Apply Bulk Discount
// @route   POST /api/services/bulk-discount
// @access  Admin
exports.applyBulkDiscount = async (req, res) => {
    try {
        const { categoryId, discountPercentage } = req.body;
        
        let query = {};
        if (categoryId) query.categoryId = categoryId; // Agar specific category pe lagana ho

        const services = await Service.find(query);
        
        // Loop and save to trigger pre-save hook for price recalculation
        for (let service of services) {
            service.discountPercentage = discountPercentage;
            await service.save();
        }

        res.status(200).json({ success: true, message: `Applied ${discountPercentage}% discount to ${services.length} services.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reset Discounts
// @route   POST /api/services/reset-discount
// @access  Admin
exports.resetDiscount = async (req, res) => {
    try {
        const services = await Service.find({ discountPercentage: { $gt: 0 } });
        
        for (let service of services) {
            service.discountPercentage = 0;
            await service.save(); // Hooks will reset price = mrp
        }

        res.status(200).json({ success: true, message: 'All discounts reset to 0.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update service details
// @route   PUT /api/services/:id
// @access  Admin
exports.updateService = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // Using save() instead of findByIdAndUpdate to trigger the discount pre-save hook
        const updateData = { ...req.body };
        if (updateData.price && !updateData.mrp) {
            updateData.mrp = updateData.price;
        } else if (updateData.mrp && !updateData.price) {
            updateData.price = updateData.mrp;
        }

        Object.assign(service, updateData);
        if (req.file) {
            service.image = req.file.path;
        }
        await service.save();

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove service
// @route   DELETE /api/services/:id
// @access  Admin
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        await service.deleteOne();
        res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};