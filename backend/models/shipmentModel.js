import mongoose from "mongoose";
import Shipment from "../models/shipmentModel.js";

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: { type: Number, required: true, unique: true },
    productName: String,
    origin: String,
    destination: String,
    status: String,
    customer: String,
    manager: String,
  },
  { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);
