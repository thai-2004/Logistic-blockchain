// scripts/deploy.js
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const ShipmentTracking = await ethers.getContractFactory("ShipmentTracking");
  const contract = await ShipmentTracking.deploy();
  await contract.waitForDeployment();

  console.log("ShipmentTracking deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
