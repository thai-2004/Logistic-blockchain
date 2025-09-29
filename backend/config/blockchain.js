import { ethers } from "ethers";
import abi from "../../artifacts/contracts/ShipmentTracking.sol/ShipmentTracking.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi.abi,
  wallet
);

export default contract;
