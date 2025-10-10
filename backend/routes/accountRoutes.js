import express from "express";
import {
  createAccount,
  getAllAccounts,
  getAccountById,
  getAccountByAddress,
  updateAccount,
  deleteAccount,
  getAccountStats,
  checkAccountExists,
  checkAccountByEmail,
  toggleAccountStatus,
  getAccountsByRole,
  login
} from "../controllers/accountController.js";
import {
  validateCreateAccount,
  validateGetAllAccounts,
  validateGetAccountById,
  validateGetAccountByAddress,
  validateUpdateAccount,
  validateDeleteAccount,
  validateCheckAccountExists,
  validateToggleAccountStatus,
  validateGetAccountsByRole
} from "../validators/account.validator.js";

const router = express.Router();

// Route lấy tất cả accounts với pagination và filter
router.get("/", validateGetAllAccounts, getAllAccounts);

// Route thống kê accounts
router.get("/stats", getAccountStats);

// Route kiểm tra account có tồn tại không
router.get("/check/:address", validateCheckAccountExists, checkAccountExists);

// Route kiểm tra account có tồn tại không bằng email
router.get("/check-email/:email", checkAccountByEmail);

// Route lấy account theo address
router.get("/address/:address", validateGetAccountByAddress, getAccountByAddress);

// Route lấy accounts theo role
router.get("/role/:role", validateGetAccountsByRole, getAccountsByRole);

// Route tạo account
router.post("/", validateCreateAccount, createAccount);

// Route đăng nhập
router.post("/login", login);

// Route lấy account theo ID
router.get("/:id", validateGetAccountById, getAccountById);

// Route cập nhật account
router.put("/:id", validateUpdateAccount, updateAccount);

// Route toggle account status (activate/deactivate)
router.patch("/:id/status", validateToggleAccountStatus, toggleAccountStatus);

// Route xóa account
router.delete("/:id", validateDeleteAccount, deleteAccount);

export default router;
