import mongoose from 'mongoose';
import 'dotenv/config';

const connUrl = process.env.mongoUrl;
console.log(connUrl);
const conn = mongoose.createConnection(connUrl);
export default conn;