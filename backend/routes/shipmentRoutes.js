import express from "express";
import { 
  createShipment, 
  getShipment, 
  getAllShipments,
  getShipmentCount, 
  updateShipment, 
  deleteShipment,
  getShipmentStats,
  getShipmentsByCustomer,
  getShipmentsByStatus,
  searchShipments,
  getShipmentTracking,
  cleanupDuplicates,
  getShipmentFee
} from "../controllers/shipmentController.js";
import { createAccount } from "../controllers/accountController.js";
import {
  validateCreateShipment,
  validateGetShipment,
  validateUpdateShipment,
  validateDeleteShipment,
  validateGetShipmentsByCustomer,
  validateGetShipmentsByStatus,
  validateSearchShipments,
  validateGetShipmentStats,
  validateGetShipmentTracking,
  validateGetAllShipments,
  default as validateShipment
} from "../validators/shipment.validator.js";

const router = express.Router();

// Route lấy tất cả shipments với pagination và filter
router.get("/", validateGetAllShipments, getAllShipments);

// Route lấy phí shipment và trạng thái fee
router.get("/fee", getShipmentFee);

// Route lấy số lượng shipments từ blockchain
router.get("/count", getShipmentCount);

// Route lấy thống kê shipments
router.get("/stats", validateGetShipmentStats, getShipmentStats);

// Route tìm kiếm shipments nâng cao
router.get("/search", validateSearchShipments, searchShipments);

// Route lấy shipments theo customer
router.get("/customer/:customer", validateGetShipmentsByCustomer, getShipmentsByCustomer);

// Route lấy shipments theo status
router.get("/status/:status", validateGetShipmentsByStatus, getShipmentsByStatus);

// Route tracking shipment với timeline
router.get("/:id/tracking", validateGetShipmentTracking, getShipmentTracking);

// Route tạo shipment
router.post("/", validateCreateShipment, createShipment);

// Route lấy shipment theo id
router.get("/:id", validateGetShipment, getShipment);

// Router sửa shipment theo id
router.put("/:id/status", validateUpdateShipment, updateShipment);

// Router delete shipment theo id
router.delete("/:id", validateDeleteShipment, deleteShipment);

// Router tạo tài khoản 
router.post("/createAccount", createAccount);

// Route cleanup duplicate shipments
router.post("/cleanup-duplicates", cleanupDuplicates);

export default router;
