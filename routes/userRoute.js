import express from 'express';
import mongoose from 'mongoose';
import wrapAsync from '../errors/wrapAsync.js';
import { userAcc } from '../models/models.js';
import { userInfo } from '../models/models.js';
import passport from 'passport';
import { isLoggedIn, saveRedirectUrl } from '../middlewares.js';
import { userJoiSchema } from '../Schema.js';
import 'dotenv/config';


const router = express.Router({ mergeParams: true });



router.get('/', isLoggedIn, wrapAsync(async (req, res, next) => {
  console.log("profile");
  console.log(req.user);
  const info = await userInfo.findOne({ userId: req.user._id }).populate('images').populate('userId');
  console.log(info);

  res.render('./pages/user', { info: info, user:res.locals.user });

}));


router.get('/logout',isLoggedIn, (req, res) => {

  try {
    req.logOut((err) => {
      if (err) {
        console.log('error in destroying session ', err);
        return res.status(500).send('Could not log out');
      }

      res.redirect('/user');
    })
  } catch (err) {
    req.flash('error', 'failed to log out');
    res.redirect('/user');
  }

});

router.get('/login', (req, res) => {
  res.render('./pages/seller');
})

router.post('/login',passport.authenticate("local", { failureRedirect: '/user/login', failureFlash: true }), saveRedirectUrl,  wrapAsync(async (req, res, next) => {

  req.flash('success', 'Loggined successfully');
  let path = res.locals.redirect || "/";
  res.redirect(path);

}));

router.get('/create', (req, res) => res.render('./pages/createAcc', { exist: false }));

router.post('/create', wrapAsync(async (req, res, next) => {

  try {
    let { name, userName, password, address } = req.body;

    let userData = {
      name: name,
      username: userName,
      address: address,
      password: password
    }

    let { error } = userJoiSchema.validate(userData);

    if (error) {
      let { status = 400, message } = error;
      return res.render('./pages/error', { message: message, status: status })
    }

    userData = {
      name: name,
      username: userName,
      address: address,
    }

    let user = new userAcc(userData);

    let registered = await userAcc.register(user, password);
    console.log('user saved');
    req.flash('success', 'Account created successfully');
    req.logIn(registered, (err) => {
      if (err) console.log(err);
      res.redirect('/user');
    })


  } catch (error) {
    req.flash('error', error.message);
    console.log(error);
    res.redirect('/user/create');
  }


}));

router.get('/:id', wrapAsync(async (req, res, next) => {
  console.log(req.params.id);
    console.log("id  id  di ", req.params.id);


  let id = new mongoose.Types.ObjectId(req.params.id);
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    req.flash('error', 'invalid user Id');
    return res.redirect('/');
  }
  const info = await userInfo.findOne({ userId: id }).populate({ path: 'reviews', populate: { path: 'givenBy', model: 'user' } }).populate('images').populate('userId');

  res.render("./pages/account", { info: info, myUser: res.locals ? res.locals.user? res.locals.user._id:false :false });
}))


export default router;