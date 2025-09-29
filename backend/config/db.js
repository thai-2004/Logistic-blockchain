import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Kết nối database thành công");
    } catch(err){
        console.log("Lỗi kết nối database: ", err.message);
        process.exit(1);
    }
}