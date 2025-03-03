import mongoose from "mongoose";

import { MONGO_URI } from "../config/env.js";

console.log(MONGO_URI)

if(!MONGO_URI) throw new Error('please define mongo db conn string')

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conncted to Database successfully.");
        
    } catch (error) {
        console.log('eror connecting db', error);
        process.exit(1);
    }
} 

export default connectToDatabase;