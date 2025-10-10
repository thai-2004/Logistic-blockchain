import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: { 
      type: Number, 
      required: true, 
      unique: true,
      min: 1
    },
    productName: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    origin: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    destination: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    status: { 
      type: String, 
      required: true,
      enum: ['Created', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Created'
    },
    customer: { 
      type: String, 
      required: true,
      trim: true
    },
    manager: { 
      type: String, 
      trim: true
    },
    driverName: {
      type: String,
      trim: true
    },
    vehiclePlate: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    blockchainTxHash: {
      type: String,
      trim: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
shipmentSchema.index({ shipmentId: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ customer: 1 });

// Virtual for formatted creation date
shipmentSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString('vi-VN');
});

export default mongoose.model("Shipment", shipmentSchema);
