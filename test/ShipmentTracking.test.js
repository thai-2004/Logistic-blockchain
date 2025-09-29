import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("ShipmentTracking", function () {
  let contract, owner, manager, customer1;

  beforeEach(async function () {
    [owner, manager, customer1] = await ethers.getSigners();

    const ShipmentTracking = await ethers.getContractFactory("ShipmentTracking");
    contract = await ShipmentTracking.deploy();
    await contract.waitForDeployment();
  });

  it("Owner mặc định cũng là manager", async function () {
    expect(await contract.managers(owner.address)).to.equal(true);
  });

  it("Tạo shipment thành công khi whitelist và phí đều tắt", async function () {
    await contract.connect(customer1).createShipment("Laptop Dell", "Hanoi", "Haiphong");
    expect(await contract.getShipmentCount()).to.equal(1n);
  });
});
