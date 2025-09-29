export default function validateShipment(req, res, next) {
  const { productName, origin, destination } = req.body;
  if (!productName || !origin || !destination) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
}
