import { error } from "console";
import { contract } from "../config/blockchain.js";
import Account from "../models/accountModel.js";

// Tạo account vừa lưu DB, vừa ghi lên blockchain nếu cần
export const createAccount = async (req, res, next) => {
  try {
    const { address, name, role = "Customer" } = req.body;

    // Validation
    if (!address || !name) {
      return res.status(400).json({ message: "Address and name are required" });
    }

    // Validate role
    const validRoles = ["Customer", "Manager", "Owner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role", 
        validRoles: validRoles 
      });
    }

    // Validate address format (basic check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ message: "Invalid address format" });
    }

    // Lưu DB trước (để tránh mất dữ liệu nếu blockchain fail)
    const account = await Account.create({ address, name, role });

    // Sync blockchain sau khi lưu DB thành công
    try {
      if (role === "Manager") {
        const tx = await contract.addManager(address);
        await tx.wait();
        console.log(`Manager ${address} added to blockchain`);
      } else if (role === "Customer") {
        const tx = await contract.addToWhitelist(address);
        await tx.wait();
        console.log(`Customer ${address} added to whitelist`);
      }
    } catch (blockchainError) {
      console.error("Blockchain sync failed:", blockchainError);
      // Không throw error vì DB đã lưu thành công
      // Có thể log hoặc thông báo cho admin
    }

    res.status(201).json({ 
      ok: true, 
      account,
      message: "Account created successfully" 
    });
  } catch (err) {
    console.error("Create account error:", err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: "Address already exists",
        field: "address"
      });
    }
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
    next(err);
  }
};

// Lấy tất cả accounts với pagination và filter
export const getAllAccounts = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    // Build filter object
    const filter = { isActive: true }; // Only show active accounts
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const accounts = await Account.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Account.countDocuments(filter);

    res.json({
      success: true,
      accounts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error("Get all accounts error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Lấy account theo ID
export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Account ID is required"
      });
    }

    const account = await Account.findById(id).select('-__v');
    
    if (account && !account.isActive) {
      return res.status(404).json({
        error: "Account not found or inactive",
        accountId: id
      });
    }

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
        accountId: id
      });
    }

    res.json({
      success: true,
      account
    });
  } catch (error) {
    console.error("Get account by ID error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Lấy account theo address
export const getAccountByAddress = async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        error: "Address is required"
      });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        error: "Invalid address format"
      });
    }

    const account = await Account.findOne({ address, isActive: true }).select('-__v');

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
        address
      });
    }

    res.json({
      success: true,
      account
    });
  } catch (error) {
    console.error("Get account by address error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Cập nhật account
export const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Account ID is required"
      });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ["Customer", "Manager", "Owner"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: "Invalid role",
          validRoles
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields to update"
      });
    }

    const account = await Account.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
        accountId: id
      });
    }

    // Sync with blockchain if role changed
    try {
      if (role === "Manager") {
        const tx = await contract.addManager(account.address);
        await tx.wait();
        console.log(`Manager ${account.address} updated in blockchain`);
      } else if (role === "Customer") {
        const tx = await contract.addToWhitelist(account.address);
        await tx.wait();
        console.log(`Customer ${account.address} updated in blockchain`);
      }
    } catch (blockchainError) {
      console.error("Blockchain sync failed:", blockchainError);
      // Don't fail the request, just log the error
    }

    res.json({
      success: true,
      message: "Account updated successfully",
      account
    });
  } catch (error) {
    console.error("Update account error:", error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Address already exists",
        field: "address"
      });
    }
    
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Xóa account
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Account ID is required"
      });
    }

    // Soft delete - set isActive to false instead of deleting
    const account = await Account.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
        accountId: id
      });
    }

    // Note: We don't remove from blockchain as it's irreversible
    // The account will remain in blockchain but marked as inactive in DB

    res.json({
      success: true,
      message: "Account deleted successfully",
      account
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Thống kê accounts
export const getAccountStats = async (req, res) => {
  try {
    const totalAccounts = await Account.countDocuments({ isActive: true });
    
    const roleStats = await Account.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const recentAccounts = await Account.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    res.json({
      success: true,
      stats: {
        totalAccounts,
        roleStats: roleStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentAccounts
      }
    });
  } catch (error) {
    console.error("Get account stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Kiểm tra account có tồn tại không
export const checkAccountExists = async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        error: "Address is required"
      });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        error: "Invalid address format"
      });
    }

    const account = await Account.findOne({ address, isActive: true });
    const exists = !!account;

    res.json({
      success: true,
      exists,
      account: exists ? account : null
    });
  } catch (error) {
    console.error("Check account exists error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Activate/Deactivate account
export const toggleAccountStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Account ID is required"
      });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        error: "isActive must be a boolean value"
      });
    }

    const account = await Account.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!account) {
      return res.status(404).json({
        error: "Account not found",
        accountId: id
      });
    }

    res.json({
      success: true,
      message: `Account ${isActive ? 'activated' : 'deactivated'} successfully`,
      account
    });
  } catch (error) {
    console.error("Toggle account status error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Get account by role
export const getAccountsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate role
    const validRoles = ["Customer", "Manager", "Owner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: "Invalid role",
        validRoles
      });
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const accounts = await Account.find({ role, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Account.countDocuments({ role, isActive: true });

    res.json({
      success: true,
      accounts,
      role,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error("Get accounts by role error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

