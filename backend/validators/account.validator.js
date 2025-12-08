import { body, param, query, validationResult } from "express-validator";

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array()
    });
  }
  next();
};

// Create account validation
export const validateCreateAccount = [
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum address format'),
  
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 100 })
    .withMessage('Email is too long')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be between 8 and 100 characters'),
  
  body('role')
    .optional()
    .isIn(['Customer', 'Manager', 'Owner'])
    .withMessage('Role must be Customer, Manager, or Owner'),
  
  handleValidationErrors
];

// Update account validation
export const validateUpdateAccount = [
  param('id')
    .isMongoId()
    .withMessage('Invalid account ID format'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  
  body('role')
    .optional()
    .isIn(['Customer', 'Manager', 'Owner'])
    .withMessage('Role must be Customer, Manager, or Owner'),
  
  handleValidationErrors
];

// Get account by ID validation
export const validateGetAccountById = [
  param('id')
    .isMongoId()
    .withMessage('Invalid account ID format'),
  
  handleValidationErrors
];

// Get account by address validation
export const validateGetAccountByAddress = [
  param('address')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum address format'),
  
  handleValidationErrors
];

// Delete account validation
export const validateDeleteAccount = [
  param('id')
    .isMongoId()
    .withMessage('Invalid account ID format'),
  
  handleValidationErrors
];

// Get all accounts query validation
export const validateGetAllAccounts = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('role')
    .optional()
    .isIn(['Customer', 'Manager', 'Owner'])
    .withMessage('Role must be Customer, Manager, or Owner'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim(),
  
  handleValidationErrors
];

// Check account exists validation
export const validateCheckAccountExists = [
  param('address')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum address format'),
  
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Toggle account status validation
export const validateToggleAccountStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid account ID format'),
  
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  
  handleValidationErrors
];

// Get accounts by role validation
export const validateGetAccountsByRole = [
  param('role')
    .isIn(['Customer', 'Manager', 'Owner'])
    .withMessage('Role must be Customer, Manager, or Owner'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];
