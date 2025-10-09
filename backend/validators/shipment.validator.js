import { body, param, query, validationResult } from "express-validator";

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Create shipment validation
export const validateCreateShipment = [
  body('productName')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters')
    .trim(),
  
  body('origin')
    .notEmpty()
    .withMessage('Origin is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Origin must be between 2 and 100 characters')
    .trim(),
  
  body('destination')
    .notEmpty()
    .withMessage('Destination is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Destination must be between 2 and 100 characters')
    .trim(),
  
  handleValidationErrors
];

// Get shipment by ID validation
export const validateGetShipment = [
  param('id')
    .isNumeric()
    .withMessage('Shipment ID must be a number'),
  
  handleValidationErrors
];

// Update shipment validation
export const validateUpdateShipment = [
  param('id')
    .isNumeric()
    .withMessage('Shipment ID must be a number'),
  
  body('status')
    .optional()
    .isIn(['Created', 'In Transit', 'Delivered', 'Cancelled'])
    .withMessage('Status must be one of: Created, In Transit, Delivered, Cancelled'),
  
  body('driverName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Driver name must be between 2 and 50 characters')
    .trim(),
  
  body('vehiclePlate')
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage('Vehicle plate must be between 2 and 20 characters')
    .trim(),
  
  body('manager')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Manager name must be between 2 and 50 characters')
    .trim(),
  
  handleValidationErrors
];

// Delete shipment validation
export const validateDeleteShipment = [
  param('id')
    .isNumeric()
    .withMessage('Shipment ID must be a number'),
  
  handleValidationErrors
];

// Get shipments by customer validation
export const validateGetShipmentsByCustomer = [
  param('customer')
    .notEmpty()
    .withMessage('Customer address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid customer address format'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['Created', 'In Transit', 'Delivered', 'Cancelled'])
    .withMessage('Status must be one of: Created, In Transit, Delivered, Cancelled'),
  
  handleValidationErrors
];

// Get shipments by status validation
export const validateGetShipmentsByStatus = [
  param('status')
    .isIn(['Created', 'In Transit', 'Delivered', 'Cancelled'])
    .withMessage('Status must be one of: Created, In Transit, Delivered, Cancelled'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('customer')
    .optional()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid customer address format'),
  
  handleValidationErrors
];

// Search shipments validation
export const validateSearchShipments = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['Created', 'In Transit', 'Delivered', 'Cancelled'])
    .withMessage('Status must be one of: Created, In Transit, Delivered, Cancelled'),
  
  query('customer')
    .optional()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid customer address format'),
  
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid ISO 8601 date'),
  
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

// Get shipment stats validation
export const validateGetShipmentStats = [
  query('period')
    .optional()
    .isIn(['all', 'today', 'week', 'month'])
    .withMessage('Period must be one of: all, today, week, month'),
  
  handleValidationErrors
];

// Get shipment tracking validation
export const validateGetShipmentTracking = [
  param('id')
    .isNumeric()
    .withMessage('Shipment ID must be a number'),
  
  handleValidationErrors
];

// Get all shipments validation
export const validateGetAllShipments = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['Created', 'In Transit', 'Delivered', 'Cancelled'])
    .withMessage('Status must be one of: Created, In Transit, Delivered, Cancelled'),
  
  query('customer')
    .optional()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid customer address format'),
  
  handleValidationErrors
];

// Legacy validator for backward compatibility
export default function validateShipment(req, res, next) {
  const { productName, origin, destination } = req.body;
  if (!productName || !origin || !destination) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
}
