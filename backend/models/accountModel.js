import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    address: { 
        type: String, 
        required: [true, "Address is required"],
        unique: true,
        validate: {
            validator: function(v) {
                return /^0x[a-fA-F0-9]{40}$/.test(v);
            },
            message: "Invalid Ethereum address format"
        }
    },
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false // Don't include password in queries by default
    },
    role: { 
        type: String, 
        enum: {
            values: ["Customer", "Manager", "Owner"],
            message: "Role must be Customer, Manager, or Owner"
        },
        default: "Customer"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
accountSchema.index({ address: 1 });
accountSchema.index({ role: 1 });
accountSchema.index({ isActive: 1 });
accountSchema.index({ createdAt: -1 });

// Virtual for account status
accountSchema.virtual('status').get(function() {
    return this.isActive ? 'active' : 'inactive';
});

// Pre-save middleware to update updatedAt
accountSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Static method to find active accounts
accountSchema.statics.findActive = function() {
    return this.find({ isActive: true });
};

// Static method to find by role
accountSchema.statics.findByRole = function(role) {
    return this.find({ role, isActive: true });
};

// Instance method to deactivate account
accountSchema.methods.deactivate = function() {
    this.isActive = false;
    return this.save();
};

// Instance method to update last login
accountSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// Instance method to compare password
accountSchema.methods.comparePassword = async function(candidatePassword) {
    return candidatePassword === this.password; // Simple comparison for now
};

export default mongoose.model("Account", accountSchema);
