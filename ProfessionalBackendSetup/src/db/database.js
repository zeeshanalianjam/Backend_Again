import mongoose from 'mongoose'
import { DB_Name } from '../constants.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        // console.log("Connection instance", connectionInstance);
        
        console.log(`Database connected with HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log(`Error in connecting to the database`, error);
        process.exit(1)
        
    }
}

export default connectDB