import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true }, // địa chỉ ví blockchain
    name: { type: String, required: true },
    role: { type: String, enum: ["Customer", "Manager", "Owner"], default: "Customer" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Account", accountSchema);
