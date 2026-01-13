import session from 'express-session';
import MongoStore from 'connect-mongo';
import 'dotenv/config';

const connUrl = process.env.mongoUrl;

export default session({
  secret: "supersecretkey", // use a strong secret in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: connUrl,      // store sessions in MongoDB
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60,  // optional: session expiry in seconds (14 days here)
    touchAfter: 24 * 3600  
  }),
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000
  }
})