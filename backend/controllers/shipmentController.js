import { contract } from "../config/blockchain.js";

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
