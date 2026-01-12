import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRETE
})

console.log(process.env.CLOUD_API_KEY);
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'WANDERLUST',
    allowedFormate: ['png', 'jpg', 'jpeg']
  },
});

export {
    cloudinary, storage
}