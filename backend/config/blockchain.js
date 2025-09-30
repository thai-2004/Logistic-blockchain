import dotenv from "dotenv";
import { ethers } from "ethers";
import abi from "../abi/ShipmentTracking.json" with { type: "json" };

dotenv.config();

let { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

if (!RPC_URL) throw new Error("RPC_URL is missing in .env");
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is missing in .env");
if (!PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY.trim();
if (PRIVATE_KEY.length !== 66) throw new Error(`PRIVATE_KEY length invalid (${PRIVATE_KEY.length}), expected 66`);
if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is missing in .env");

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, wallet);

export { provider, wallet, contract };
