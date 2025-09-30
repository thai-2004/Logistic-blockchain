// scripts/deploy-local.js
import fs from "fs";
import path from "path";
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Deploying ShipmentTracking to local Hardhat node...");

  const ShipmentTracking = await ethers.getContractFactory("ShipmentTracking");
  const contract = await ShipmentTracking.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ ShipmentTracking deployed to:", contractAddress);

  // --- Update .env file ---
  const envPath = path.resolve(".env");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");

    // Nếu đã có CONTRACT_ADDRESS thì thay thế
    if (envContent.match(/^CONTRACT_ADDRESS=/m)) {
      envContent = envContent.replace(
        /^CONTRACT_ADDRESS=.*$/m,
        `CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nCONTRACT_ADDRESS=${contractAddress}\n`;
    }
  } else {
    envContent = `CONTRACT_ADDRESS=${contractAddress}\n`;
  }

  fs.writeFileSync(envPath, envContent, "utf8");
  console.log("📝 Updated .env with CONTRACT_ADDRESS:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
