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


export const deleteShipment = async (req, res) => {
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

// Get shipment statistics
export const getShipmentStats = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    let dateFilter = {};
    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter.createdAt = { $gte: today };
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter.createdAt = { $gte: weekAgo };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter.createdAt = { $gte: monthAgo };
    }

    // Get total shipments
    const totalShipments = await Shipment.countDocuments(dateFilter);
    
    // Get shipments by status
    const statusStats = await Shipment.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get shipments by customer
    const customerStats = await Shipment.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$customer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get recent shipments
    const recentShipments = await Shipment.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('shipmentId productName status customer createdAt');

    res.json({
      success: true,
      stats: {
        totalShipments,
        statusStats: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        topCustomers: customerStats,
        recentShipments
      }
    });
  } catch (error) {
    console.error("Get shipment stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Get shipments by customer
export const getShipmentsByCustomer = async (req, res) => {
  try {
    const { customer } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    if (!customer) {
      return res.status(400).json({ 
        error: "Customer address is required" 
      });
    }

    // Build filter
    const filter = { customer };
    if (status) filter.status = status;

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
      customer,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error("Get shipments by customer error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Get shipments by status
export const getShipmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10, customer } = req.query;
    
    if (!status || !['Created', 'In Transit', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Must be one of: Created, In Transit, Delivered, Cancelled" 
      });
    }

    // Build filter
    const filter = { status };
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
      status,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error("Get shipments by status error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Advanced search shipments
export const searchShipments = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      query, 
      status, 
      customer, 
      productName,
      origin,
      destination,
      dateFrom,
      dateTo
    } = req.query;
    
    // Build search filter
    const filter = {};
    
    if (query) {
      filter.$or = [
        { productName: { $regex: query, $options: 'i' } },
        { origin: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } },
        { customer: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (customer) filter.customer = { $regex: customer, $options: 'i' };
    if (productName) filter.productName = { $regex: productName, $options: 'i' };
    if (origin) filter.origin = { $regex: origin, $options: 'i' };
    if (destination) filter.destination = { $regex: destination, $options: 'i' };
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

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
      searchParams: {
        query,
        status,
        customer,
        productName,
        origin,
        destination,
        dateFrom,
        dateTo
      },
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error("Search shipments error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};

// Get shipment tracking timeline
export const getShipmentTracking = async (req, res) => {
  try {
    const { id } = req.params;
    
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

    // Create tracking timeline based on status and timestamps
    const timeline = [];
    
    timeline.push({
      status: 'Created',
      timestamp: shipment.createdAt,
      description: 'Shipment created',
      completed: true
    });

    if (shipment.status === 'In Transit' || shipment.status === 'Delivered') {
      timeline.push({
        status: 'In Transit',
        timestamp: shipment.updatedAt,
        description: 'Shipment in transit',
        completed: shipment.status === 'In Transit' || shipment.status === 'Delivered'
      });
    }

    if (shipment.status === 'Delivered') {
      timeline.push({
        status: 'Delivered',
        timestamp: shipment.updatedAt,
        description: 'Shipment delivered',
        completed: true
      });
    }

    if (shipment.status === 'Cancelled') {
      timeline.push({
        status: 'Cancelled',
        timestamp: shipment.updatedAt,
        description: 'Shipment cancelled',
        completed: true
      });
    }

    res.json({
      success: true,
      shipment: {
        shipmentId: shipment.shipmentId,
        productName: shipment.productName,
        origin: shipment.origin,
        destination: shipment.destination,
        status: shipment.status,
        customer: shipment.customer,
        manager: shipment.manager,
        driverName: shipment.driverName,
        vehiclePlate: shipment.vehiclePlate,
        blockchainTxHash: shipment.blockchainTxHash
      },
      timeline
    });
  } catch (error) {
    console.error("Get shipment tracking error:", error);
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};


