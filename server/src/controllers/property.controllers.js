const propertyModel = require("../models/property.model");
const cloudinaryUpload = require("../utils/cloudinary");
const isPropertyOwner = require("../utils/isPropertyOwner");

//create property
const listProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      purpose,
      propertyType,
      price,
      address,
      bathrooms,
      bedrooms,
      area,
      areaUnit,
    } = req.body;

    if (
      !title ||
      !description ||
      price === null ||
      !address ||
      area === null ||
      !areaUnit
    ) {
      return res.status(401).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const owner = req.user.userid;
    const imagePath = req.file?.path;
    const uploadImage = await cloudinaryUpload(imagePath);

    if (!uploadImage) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary image upload failed",
      });
    }

    const property = await propertyModel.create({
      title,
      description,
      owner,
      purpose,
      propertyType,
      price,
      address,
      bathrooms,
      bedrooms,
      area,
      areaUnit,
      image: uploadImage?.url,
    });

    return res.status(201).json({
      success: true,
      message: "Property listed.",
      property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all property
const getProperties = async (req, res) => {
  try {
    const properties = await propertyModel.find();

    if (!properties) {
      return res.status(404).json({
        success: false,
        message: "No Properties",
      });
    }

    return res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get one property
const getOneProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await propertyModel.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update property

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      purpose,
      propertyType,
      price,
      address,
      bathrooms,
      bedrooms,
      area,
      areaUnit,
    } = req.body;

    // Find property first
    const existingProperty = await propertyModel.findById(id);

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    if (!isPropertyOwner(existingProperty, req.user?.userid)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this property",
      });
    }

    // Update only the fields provided
    const updateData = {};

    const fields = {
      title,
      description,
      purpose,
      propertyType,
      price,
      address,
      bathrooms,
      bedrooms,
      area,
      areaUnit,
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    // Upload image only if a new image is provided
    if (req.file?.path) {
      const uploadImage = await cloudinaryUpload(req.file.path);
      updateData.image = uploadImage.url;
    }

    const property = await propertyModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Property updated successfully!",
      property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProperty = await propertyModel.findById(id);

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    if (!isPropertyOwner(existingProperty, req.user?.userid)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this property",
      });
    }

    await propertyModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Property Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//my properties
const myProperties = async (req, res) => {
  try {
    const owner = req.user.userid;

    const properties = await propertyModel.find({ owner });

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetch successfully!",
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  listProperty,
  getProperties,
  getOneProperty,
  updateProperty,
  deleteProperty,
  myProperties,
};
