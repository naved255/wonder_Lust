import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import wrapAsync from './errors/wrapAsync.js';
import { userAcc, userInfo } from './models/models.js';
import { likes } from './models/models.js';
import userRoute from './routes/userRoute.js';
import likeRoute from './routes/like.Route.js';
import reviewRoute from './routes/reviewRoute.js';
import imageUploadRoute from './routes/imageUploadRoute.js';
import Session from './session.js';
import flash from 'connect-flash';
import passport from 'passport';
import localStrategy from 'passport-local'
import methodOverride from 'method-override'
import cors from 'cors'
import 'dotenv/config';
import { fileURLToPath } from 'url';

console.log(process.env.CLOUD_NAME);

const port = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const connUrl = process.env.mongoUrl;
console.log(connUrl);
const conn = mongoose.createConnection(connUrl);

app.use(Session);
app.use(flash());
// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userAcc.authenticate()));
passport.serializeUser(userAcc.serializeUser());
passport.deserializeUser(userAcc.deserializeUser());

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
app.use(methodOverride('_method'));
app.use(cors());

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  } else {
    res.locals.user = undefined;
  }
  next();
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use('/user', userRoute);
app.use('/user', likeRoute);
app.use('/user', reviewRoute);
app.use('/image', imageUploadRoute);

// Routes
app.get('/', wrapAsync(async (req, res, next) => {
  let info = await userInfo.find({}).populate('userId').populate('images').populate('reviews');
  let like = await likes.find({likedFrom: res.locals ? res.locals.user ? res.locals.user._id : undefined : undefined}).populate('likedTo');
  console.log(info);
  res.render('./pages/home', { info: info, like: like, userId: res.locals ? res.locals.user ? res.locals.user._id : undefined : undefined });
}))



app.use((err, req, res, next) => {
  console.log(err);
  let { status = 500, message } = err;
  res.status(status).render('./pages/error.ejs', { message: message, status: status });
});

app.use((req, res) => {
  res.status(404).render("./pages/error.ejs", { message: 'Page not found', status: 404 });
})

conn.once('open', () => {
  console.log('MongoDB connected');
  app.listen(port, () => console.log(`Server running on port: ${port}`));
});
