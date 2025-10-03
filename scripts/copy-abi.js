import fs from "fs";
import path from "path";

const source = path.resolve(
  "artifacts/contracts/Shipment.sol/ShipmentTracking.json"
);

const destDir = path.resolve("backend/abi");
const dest = path.join(destDir, "ShipmentTracking.json");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (!fs.existsSync(source)) {
  console.error("ABI not found at:", source);
  process.exit(1);
}

fs.copyFileSync(source, dest);
console.log("ABI copied to backend/abi/ShipmentTracking.json");
