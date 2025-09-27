import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import cors from "cors";
import contractABI from "../artifacts/contracts/Shipment.sol/ShipmentTracking.json" assert { type: "json" };

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // ⚡ thay bằng địa chỉ sau khi deploy
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);

// API tạo shipment
app.post("/create", async (req, res) => {
  try {
    const { productName, driver, vehicle } = req.body;
    const tx = await contract.createShipment(productName, driver, vehicle);
    await tx.wait();
    res.json({ message: "Shipment created", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API cập nhật shipment
app.post("/update", async (req, res) => {
  try {
    const { id, status } = req.body;
    const tx = await contract.updateShipment(id, status);
    await tx.wait();
    res.json({ message: "Shipment updated", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API lấy shipment
app.get("/shipment/:id", async (req, res) => {
  try {
    const s = await contract.getShipment(req.params.id);
    res.json({
      id: s[0].toString(),
      productName: s[1],
      driver: s[2],
      vehicle: s[3],
      status: s[4],
      owner: s[5]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Backend running at http://localhost:3000"));
