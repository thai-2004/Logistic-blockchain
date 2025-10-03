import { error } from "console";
import { contract } from "../config/blockchain.js";
import Shipment from "../models/shipmentModel.js";


export const getShipmentCount = async (req, res) => {
  try {
    const count = await contract.getShipmentCount();
    res.json({ count: Number(count) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blockchain error" });
  }
};

export const createShipment = async (req, res, next) => {
  try {
    const { productName, origin, destination } = req.body;

    const tx = await contract.createShipment(productName, origin, destination);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "ShipmentCreated");

    const shipmentId = event?.args?.id.toString();

    const shipment = await Shipment.create({
      shipmentId,
      productName,
      origin,
      destination,
      status: "Created",
      customer: receipt.from,
    });

    res.status(201).json({ ok: true, shipment });
  } catch (err) {
    next(err);
  }
};

export const getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ shipmentId: req.params.id });
    if (!shipment) return res.status(404).json({ error: "Not found" });
    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

export const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;       // ví dụ "1"
    const { status } = req.body;     // ví dụ { status: "Delivered" }

    const shipment = await Shipment.findOneAndUpdate(
      { shipmentId: id.toString() },    // tìm theo shipmentId
      { status },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteeShipment = async (req, res) => {
  try{
    const {id} = req.params;
    // Chỉ xóa trong DB không xóa trong blockchaing
    const result = await Shipment.findOneAndDelete({ shipmentId: id.toString() });


    if(!result){
      return res.status(400).json({message: "Not found in DB"});
    }
  }catch (err){
    console.error(err);
    res.status(500).json({message : "Block chain err", error: error.message});
  }
};


