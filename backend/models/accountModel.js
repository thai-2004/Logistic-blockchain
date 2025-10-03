import mongoose from "mongoose";
import Account from "../models/accountModel.js"

const accoutnSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true }, // địa chỉ ví blockchain
    name: { type: String, required: true },
    role: { type: String, enum: ["Customer", "Manager", "Owner"], default: "Customer" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Account", accountSchema);
