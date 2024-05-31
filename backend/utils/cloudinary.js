const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

cloudinary.config({ 
  cloud_name: process.env.COLUDINARY_CLOUD_NAME, 
  api_key: process.env.COLUDINARY_API_KEY, 
  api_secret: process.env.COLUDINARY_API_SECRET 
});

const uploadImage = async (filePath) => {
    try {
        console.log("filepth is ",filePath);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'user_profiles',
      });
      fs.unlinkSync(filePath); // Remove file from server after upload
      return result.secure_url;
    } catch (error) {
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

module.exports = uploadImage;