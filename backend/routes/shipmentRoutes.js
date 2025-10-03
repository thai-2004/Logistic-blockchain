import express from "express";
import { createShipment, getShipment, getShipmentCount, updateShipment, deleteeShipment } from "../controllers/shipmentController.js";
import validateShipment from "../validators/shipment.validator.js";

const router = express.Router();

router.get("/count", getShipmentCount);

// Route tạo shipment
router.post("/", validateShipment, createShipment);

// Route lấy shipment theo id
router.get("/:id", getShipment);

// Router sửa shipment theo id
router.put("/:id/status", updateShipment);

// Router delete shipment theo id
router.delete("/id", deleteeShipment);
export default router;
