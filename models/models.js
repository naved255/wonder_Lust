import mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'
import 'dotenv/config';

const connUrl = process.env.mongoUrl;

// ✅ Use one connection everywhere
const conn = mongoose.createConnection(connUrl);

// Schema & Model on the same connection
const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
});

accountSchema.plugin(passportLocalMongoose);

const userInfoSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'Welcome to your perfect stay! This cozy and well-maintained home offers a comfortable living space with all the essentials you need. Located in a safe and quiet neighborhood, the property is close to local shops, restaurants, and public transport, making it convenient for both short and long stays.\nThe house features spacious rooms, clean interiors, and plenty of natural light. Whether you’re a small family, a group of friends, or a solo traveler, this home provides the privacy and comfort you deserve.'
  },

  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'image'
    },
  ],

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
    },
  ],

 geometry:{
  type:{
    type:String,
    enum:['Point'],
     required:true
  },

  coordinates:{
    type:[Number],
    required:true
  }
  
 }
})

const likeSchema = new mongoose.Schema({
  likedFrom: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likedTo: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
})

const userReviewSchema = new mongoose.Schema({
  givenBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  rating: {
    type: Number,
    required: true
  },

  review: {
    type: String,
    required: true
  }
})

const imagesSchema = new mongoose.Schema({
  path: {
    type: String,
    require: true,
  },
  filename: String
})

export const imageModel = conn.model('image', imagesSchema);

export const userAcc = conn.model('user', accountSchema);  // ✅ use conn.model

export const userInfo = conn.model('info', userInfoSchema);

export const likes = conn.model('like', likeSchema);

export const userReview = conn.model('review', userReviewSchema);