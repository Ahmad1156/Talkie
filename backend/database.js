import mongoose from "mongoose";

mongoose.set('strictQuery', false);
export const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
