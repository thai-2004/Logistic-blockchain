import express from "express";
import { createShipment, getShipment } from "../controllers/shipmentController.js";
import validateShipment from "../validators/shipment.validator.js";

const router = express.Router();

router.post("/", validateShipment, createShipment);
router.get("/:id", getShipment);

export default router;
