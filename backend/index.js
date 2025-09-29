import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.use("/api/shipments", shipmentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
