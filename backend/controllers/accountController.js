import { error } from "console";
import { contract } from "../config/blockchain.js";
import Account from "../models/shipmentModel.js";

// Tạo account vừa lưu DB, vừa ghi lên blockchain nếu cần
export const createAccount = async (req, res, next) => {
  try {
    const { address, name, role } = req.body;

    if (!address || !name) {
      return res.status(400).json({ message: "Address and name are required" });
    }

    // Nếu muốn sync blockchain
    if (role === "Manager") {
      const tx = await contract.addManager(address);
      await tx.wait();
    } else if (role === "Customer") {
      const tx = await contract.addToWhitelist(address);
      await tx.wait();
    }

    // Lưu DB
    const account = await Account.create({ address, name, role });

    res.status(201).json({ ok: true, account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
    next(err);
  }
};

