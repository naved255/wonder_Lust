import express from 'express';
import wrapAsync from '../errors/wrapAsync.js';
import { likes } from '../models/models.js';
import session from '../session.js';


const router = express.Router()

router.use(session);

router.post('/like', wrapAsync(async (req, res, next) => {

  let { user, userId } = req.query;
  if (userId) {

    let liked = await likes.find({ likedFrom: userId, likedTo: user });

    if (liked.length > 0) {
      console.log('already liked');
      return res.send({ liked: false, message: 'already liked' });
    }

    let obj = {
      likedFrom: userId,
      likedTo: user
    }

    let l = new likes(obj);
    l.save().then(() => { console.log('user liked') }).catch(err => console.log('error in liking: ', err));
    res.send({ liked: true, message: 'liked succesfully' });

  } else {
    res.send({ liked: false, message: 'login required' });
  }

}))

router.post('/dislike', wrapAsync(async (req, res, next) => {

  let { user, userId } = req.query;
  if (userId) {

    let liked = likes.findOneAndDelete({ likedFrom: userId, likedTo: user }).then(() => {
      console.log('liked removed');
      res.send({ liked: true, message: 'removed liked succesfully' });
    }).catch((err) => {
      console.log('error in removing like: ', err);
      res.send({ liked: false, message: `something eror in remvign like: ${err}` });
    })


  } else {
    res.send({ liked: false, message: 'login required' });
  }

}));

export default router;