import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("ShipmentTracking", function () {
  let contract, owner, manager, customer1, customer2;

  beforeEach(async function () {
    [owner, manager, customer1, customer2] = await ethers.getSigners();
    const ShipmentTracking = await ethers.getContractFactory("ShipmentTracking");
    contract = await ShipmentTracking.deploy();
    await contract.waitForDeployment();
  });

  it("Owner mặc định cũng là manager", async function () {
    expect(await contract.managers(owner.address)).to.equal(true);
  });

  it("Owner có thể thêm manager", async function () {
    await contract.connect(owner).addManager(manager.address);
    expect(await contract.managers(manager.address)).to.equal(true);
  });

  it("Không phải owner thì không thể thêm manager", async function () {
    await expect(contract.connect(customer1).addManager(customer2.address))
      .to.be.revertedWith("Not owner");
  });

  it("Tạo shipment thành công khi whitelist và phí đều tắt", async function () {
    await contract.connect(customer1).createShipment("Laptop", "Hanoi", "Haiphong");
    expect(await contract.getShipmentCount()).to.equal(1n);
  });

  it("Không thể tạo shipment nếu bật whitelist nhưng chưa whitelist user", async function () {
    await contract.connect(owner).toggleWhitelist(true);
    await expect(
      contract.connect(customer1).createShipment("Phone", "Hanoi", "Saigon")
    ).to.be.revertedWith("Not whitelisted");
  });

  it("Có thể tạo shipment khi đã whitelist user", async function () {
    await contract.connect(owner).toggleWhitelist(true);
    await contract.connect(owner).addToWhitelist(customer1.address);
    await contract.connect(customer1).createShipment("Tablet", "Hanoi", "Danang");
    expect(await contract.getShipmentCount()).to.equal(1n);
  });

  it("Không thể tạo shipment nếu bật phí nhưng không gửi đủ ETH", async function () {
    await contract.connect(owner).toggleFee(true);
    await contract.connect(owner).setShipmentFee(ethers.parseEther("0.01"));
    await expect(
      contract.connect(customer1).createShipment("Macbook", "Hue", "Saigon", { value: 0 })
    ).to.be.revertedWith("Insufficient fee");
  });

  it("Có thể tạo shipment khi gửi đủ phí", async function () {
    await contract.connect(owner).toggleFee(true);
    await contract.connect(owner).setShipmentFee(ethers.parseEther("0.01"));
    await contract.connect(customer1).createShipment("iPad", "Hue", "Saigon", {
      value: ethers.parseEther("0.01"),
    });
    expect(await contract.getShipmentCount()).to.equal(1n);
    expect(await contract.getCollectedFees()).to.equal(ethers.parseEther("0.01"));
  });

  it("Owner có thể rút phí đã thu", async function () {
    await contract.connect(owner).toggleFee(true);
    await contract.connect(owner).setShipmentFee(ethers.parseEther("0.01"));
    await contract.connect(customer1).createShipment("iPad", "Hue", "Saigon", {
      value: ethers.parseEther("0.01"),
    });

    const balanceBefore = await ethers.provider.getBalance(owner.address);
    const tx = await contract.connect(owner).withdrawFees();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;
    const balanceAfter = await ethers.provider.getBalance(owner.address);

    expect(balanceAfter + gasUsed).to.be.greaterThanOrEqual(balanceBefore);
  });

  it("Manager có thể gán tài xế và phương tiện", async function () {
    await contract.connect(customer1).createShipment("TV", "HN", "HCM");
    await contract.connect(owner).addManager(manager.address);
    await contract.connect(manager).assignShipment(1, "Driver A", "29A-12345");

    const shipment = await contract.getShipment(1);
    expect(shipment[2]).to.equal("Driver A");
    expect(shipment[3]).to.equal("29A-12345");
  });

  it("Manager có thể cập nhật trạng thái shipment", async function () {
    await contract.connect(customer1).createShipment("Fridge", "HN", "DN");
    await contract.connect(owner).addManager(manager.address);
    await contract.connect(manager).updateStatus(1, 2); // InTransit
    const shipment = await contract.getShipment(1);
    expect(shipment[6]).to.equal(2); // Status.InTransit
  });

  it("Manager có thể thêm checkpoint", async function () {
    await contract.connect(customer1).createShipment("Bike", "HN", "DN");
    await contract.connect(owner).addManager(manager.address);
    await contract.connect(manager).addCheckpoint(1, "Checkpoint1", 21000000, 105000000);

    expect(await contract.getCheckpointCount(1)).to.equal(1n);
    const cp = await contract.getCheckpoint(1, 0);
    expect(cp[0]).to.equal("Checkpoint1");
  });
});
