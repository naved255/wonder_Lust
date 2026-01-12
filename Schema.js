import Joi from "joi";
import mongoose from "mongoose";

export const userJoiSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
});

export const userInfoValidationSchema = Joi.object({
  userId: Joi.object().instance(mongoose.Types.ObjectId),
  country: Joi.string().default("India"),

  address: Joi.string().required(),
  price: Joi.number().required(),
  phone: Joi.number().required(),

  description: Joi.string().default(
    "Welcome to your perfect stay! This cozy and well-maintained home offers a comfortable living space with all the essentials you need. Located in a safe and quiet neighborhood, the property is close to local shops, restaurants, and public transport, making it convenient for both short and long stays.\nThe house features spacious rooms, clean interiors, and plenty of natural light. Whether you’re a small family, a group of friends, or a solo traveler, this home provides the privacy and comfort you deserve."
  ),

  images: Joi.array().items(Joi.object().instance(mongoose.Types.ObjectId)),   // list of ObjectId strings
  reviews: Joi.array().items(Joi.object().instance(mongoose.Types.ObjectId)),  // list of ObjectId strings

  geometry: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array()
      .items(Joi.number().required())  // [longitude, latitude]
      .length(2)
      .required(),
  }).required(),
});