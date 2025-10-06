import { error } from "console";
import { contract } from "../config/blockchain.js";
import Shipment from "../models/shipmentModel.js";


export const getShipmentCount = async (req, res) => {
  try {
    const count = await contract.getShipmentCount();
    res.json({ 
      success: true,
      count: Number(count) 
    });
  } catch (error) {
    console.error("Get shipment count error:", error);
    res.status(500).json({ 
      error: "Blockchain error",
      message: error.message 
    });
  }
};

export const getAllShipments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customer } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = { $regex: customer, $options: 'i' };

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const shipments = await Shipment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Shipment.countDocuments(filter);

    res.json({
      success: true,
      shipments,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error("Get all shipments error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

export const createShipment = async (req, res, next) => {
  try {
    const { productName, origin, destination } = req.body;

    // Validate required fields
    if (!productName || !origin || !destination) {
      return res.status(400).json({ 
        error: "Missing required fields: productName, origin, destination" 
      });
    }

    // Create shipment on blockchain
    const tx = await contract.createShipment(productName, origin, destination);
    const receipt = await tx.wait();

    // Parse event from transaction receipt
    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "ShipmentCreated");

    if (!event) {
      return res.status(500).json({ 
        error: "Failed to parse ShipmentCreated event" 
      });
    }

    const shipmentId = Number(event.args.id);

    // Create shipment in database
    const shipment = await Shipment.create({
      shipmentId,
      productName,
      origin,
      destination,
      status: "Created",
      customer: receipt.from,
      blockchainTxHash: receipt.hash
    });

    res.status(201).json({ 
      success: true, 
      message: "Shipment created successfully",
      shipment 
    });
  } catch (err) {
    console.error("Create shipment error:", err);
    next(err);
  }
};

export const getShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate shipment ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        error: "Invalid shipment ID" 
      });
    }

    const shipment = await Shipment.findOne({ shipmentId: Number(id) });
    
    if (!shipment) {
      return res.status(404).json({ 
        error: "Shipment not found",
        shipmentId: id 
      });
    }
    
    res.json({
      success: true,
      shipment
    });
  } catch (err) {
    console.error("Get shipment error:", err);
    next(err);
  }
};

export const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverName, vehiclePlate, manager } = req.body;

    // Validate shipment ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        error: "Invalid shipment ID" 
      });
    }

    // Validate status if provided
    if (status && !['Created', 'In Transit', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Must be one of: Created, In Transit, Delivered, Cancelled" 
      });
    }

    // Prepare update object
    const updateData = {};
    if (status) updateData.status = status;
    if (driverName) updateData.driverName = driverName;
    if (vehiclePlate) updateData.vehiclePlate = vehiclePlate;
    if (manager) updateData.manager = manager;

    const shipment = await Shipment.findOneAndUpdate(
      { shipmentId: Number(id) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!shipment) {
      return res.status(404).json({ 
        error: "Shipment not found",
        shipmentId: id 
      });
    }

    res.json({
      success: true,
      message: "Shipment updated successfully",
      shipment
    });
  } catch (error) {
    console.error("Update shipment error:", error);
    res.status(500).json({ 
      error: "Server error",
      message: error.message 
    });
  }
};


export const deleteeShipment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate shipment ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        error: "Invalid shipment ID" 
      });
    }

    // Only delete from DB, not from blockchain
    const result = await Shipment.findOneAndDelete({ shipmentId: Number(id) });

    if (!result) {
      return res.status(404).json({
        error: "Shipment not found",
        shipmentId: id
      });
    }

    res.json({
      success: true,
      message: "Shipment deleted successfully",
      shipment: result
    });
  } catch (err) {
    console.error("Delete shipment error:", err);
    res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
};


