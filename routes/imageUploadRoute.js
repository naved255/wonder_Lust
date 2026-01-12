import express from 'express';
import mongoose from 'mongoose';
import expressError from '../errors/expressError.js';
import wrapAsync from '../errors/wrapAsync.js';
import { userInfo, imageModel } from '../models/models.js';
import { cloudinary, storage } from '../cloudinaryConfig.js';
import multer from 'multer';
import session from '../session.js';
import { isLoggedIn, saveRedirectUrl } from '../middlewares.js';
import { userInfoValidationSchema } from '../Schema.js';
import 'dotenv/config';


const router = express.Router({ mergeParams: true });

router.use(session);


const connUrl = process.env.mongoUrl;

// ✅ Use one connection everywhere
const conn = mongoose.createConnection(connUrl);


const upload = multer({ storage });



router.get('/upload', isLoggedIn, wrapAsync(async (req, res) => {

  let userId = req.user?._id;
  console.log("UserID type:", typeof userId, "value:", userId);

  if (!userId) {
    req.flash('error', 'user Id not found, please login again');
    return res.redirect('/user/login');
  }

  let data = await userInfo.findOne({ userId: req.user.id }).populate('images');
  res.render('./pages/renting', { data: data });

}));



router.patch("/upload", isLoggedIn, saveRedirectUrl, upload.array("files"), wrapAsync(async (req, res, next) => {

  const { country, address, price, phone, description, longitude, latitude } = req.body;

  let user = await userInfo.findOne({ userId: req.user._id }).populate('images');

  if (!user) {
    req.flash('error', 'Cannot update your profile');
    return res.redirect(res.locals.redirect);
  }

  user.country = country || user.country;
  user.address = address || user.address;
  user.price = price || user.price;
  user.phone = phone || user.phone;
  user.description = description && description.trim() !== '' ? description : user.description;


  if (latitude && longitude) {
    user.geometry = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };
  }


  user.images.map((item) => {
    cloudinary.uploader.destroy(item.filename);
  })

  await imageModel.deleteMany({ _id: { $in: user.images.map(item => item._id) } });
  user.images = [];

  const uploads = req.files.map(async (item) => {
    const { path, filename } = item;
    const image = new imageModel({ path, filename });
    await image.save();
    user.images.push(image._id);
  });

  await Promise.all(uploads);
  await user.save();

  req.flash('success', 'Updated successfully');
  res.redirect('/user');

}));


router.post("/upload", isLoggedIn, upload.array("files"), wrapAsync(async (req, res, next) => {

  if (!req.files || req.files.length === 0) {
    return next(new expressError(400, 'no file uploaded'));
  }

  let { country, address, price, phone, description, longitude, latitude } = req.body;
  console.log("req.user._id", req.user._id);
  console.log("latitude", latitude, " longitutde ", longitude);
  let infoData = {
    userId: req.user._id,
    country: country, address: address,
    price: price,
    phone: phone,
    description: description && description.trim() !== '' ? description : undefined,
    geometry: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    }
  }

  console.log("infoData ", infoData);

  let { error, value } = userInfoValidationSchema.validate(infoData);

  if (error) {
    req.flash('error', `House info invalide due to: ${error.message}`);
    return res.redirect('/image/upload');
  }

  let info = new userInfo(infoData);

  let uploads = req.files.map((item) => {

    return new Promise(async (res, rej) => {
      let { path, filename } = item;
      let image = new imageModel({ path: path, filename: filename });
      await image.save();
      info.images.push(image);

      res();
    })
  })


  await Promise.all(uploads);
  await info.save();

  req.flash('success', "Uploaded successfully");
  res.redirect('/user');

}));




export default router;