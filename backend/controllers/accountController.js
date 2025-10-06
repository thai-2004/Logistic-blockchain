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

