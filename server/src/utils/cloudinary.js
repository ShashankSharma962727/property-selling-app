
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (filepath) => {
  if (!filepath) {
    throw new Error("Image file path is missing. Check req.file");
  }

  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "image",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  } finally {
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
};

module.exports = cloudinaryUpload;
