const Service = require('../models/Service');

exports.createService = async (req, res) => {
    try {
        const serviceData = { ...req.body };

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
            serviceData.image = req.file.path; 
        }

        const service = await Service.create(serviceData);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true }).populate('categoryId', 'name');
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('categoryId', 'name');
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.applyBulkDiscount = async (req, res) => {
    try {
        const { categoryId, discountPercentage } = req.body;
        
        let query = {};
        if (categoryId) query.categoryId = categoryId; 

        const services = await Service.find(query);

        for (let service of services) {
            service.discountPercentage = discountPercentage;
            await service.save();
        }

        res.status(200).json({ success: true, message: `Applied ${discountPercentage}% discount to ${services.length} services.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetDiscount = async (req, res) => {
    try {
        const services = await Service.find({ discountPercentage: { $gt: 0 } });
        
        for (let service of services) {
            service.discountPercentage = 0;
            await service.save(); 
        }

        res.status(200).json({ success: true, message: 'All discounts reset to 0.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

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