import express from 'express';
import wrapAsync from '../errors/wrapAsync.js';

import mongoose from 'mongoose'
import { userInfo, userReview } from '../models/models.js';
import { isLoggedIn } from '../middlewares.js';


const router = express.Router({mergeParams: true});



router.get('/:id/review', (req, res) => {
  res.redirect(`/user/${req.params.id}`);
})

router.post('/:userId/review',isLoggedIn, wrapAsync( async (req, res, next) => {

  let { userId } = req.params;
  let {rating, review} = req.body;
  let objId = new mongoose.Types.ObjectId(userId);

  let info = await userInfo.findOne({userId:objId});


  let rev = new userReview({givenBy:req.user._id , rating:rating, review:review});
  info.reviews.push(rev);
  await rev.save();
  await info.save();
  res.redirect(`/user/${objId}`);
  
}))

export default router;