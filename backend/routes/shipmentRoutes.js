import express from "express";
import { createShipment, getShipment, getShipmentCount } from "../controllers/shipmentController.js";
import validateShipment from "../validators/shipment.validator.js";

const router = express.Router();

router.get("/count", getShipmentCount);

// Route tạo shipment
router.post("/", validateShipment, createShipment);

// Route lấy shipment theo id
router.get("/:id", getShipment);

export default router;
