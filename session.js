import session from 'express-session';
import MongoStore from 'connect-mongo';

const connUrl = 'mongodb://127.0.0.1:27017/images';

export default session({
  secret: "supersecretkey", // use a strong secret in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: connUrl,      // store sessions in MongoDB
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60  // optional: session expiry in seconds (14 days here)
  }),
  cookie: {
    secure: true,           // set true if using HTTPS
    maxAge: 14 * 24 * 60 * 60 * 1000 // optional: cookie expiry (14 days)
  }
})