# Account Management API Documentation

## Overview

Complete API documentation for account management in the logistics blockchain system.

## Base URL

```
http://localhost:4000/api/accounts
```

## Authentication

Currently no authentication required (for development). In production, implement JWT or OAuth2.

## Account Model

```javascript
{
  _id: "ObjectId",
  address: "0x...", // Ethereum address (unique)
  name: "John Doe",
  role: "Customer" | "Manager" | "Owner",
  isActive: true,
  lastLogin: "2024-01-01T00:00:00.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

### 1. Get All Accounts

**GET** `/api/accounts`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `role` (optional): Filter by role (Customer, Manager, Owner)
- `search` (optional): Search by name or address

**Example:**

```bash
GET /api/accounts?page=1&limit=10&role=Customer&search=john
```

**Response:**

```json
{
  "success": true,
  "accounts": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### 2. Get Account by ID

**GET** `/api/accounts/:id`

**Example:**

```bash
GET /api/accounts/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "account": {
    "_id": "507f1f77bcf86cd799439011",
    "address": "0x1234...",
    "name": "John Doe",
    "role": "Customer",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Account by Address

**GET** `/api/accounts/address/:address`

**Example:**

```bash
GET /api/accounts/address/0x1234567890123456789012345678901234567890
```

### 4. Get Accounts by Role

**GET** `/api/accounts/role/:role`

**Parameters:**

- `role`: Customer, Manager, or Owner

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**

```bash
GET /api/accounts/role/Customer?page=1&limit=5
```

### 5. Create Account

**POST** `/api/accounts`

**Request Body:**

```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "name": "John Doe",
  "role": "Customer"
}
```

**Response:**

```json
{
  "ok": true,
  "account": {
    "_id": "507f1f77bcf86cd799439011",
    "address": "0x1234...",
    "name": "John Doe",
    "role": "Customer",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Account created successfully"
}
```

### 6. Update Account

**PUT** `/api/accounts/:id`

**Request Body:**

```json
{
  "name": "John Smith",
  "role": "Manager"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account updated successfully",
  "account": {
    "_id": "507f1f77bcf86cd799439011",
    "address": "0x1234...",
    "name": "John Smith",
    "role": "Manager",
    "isActive": true,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Toggle Account Status

**PATCH** `/api/accounts/:id/status`

**Request Body:**

```json
{
  "isActive": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account deactivated successfully",
  "account": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 8. Delete Account (Soft Delete)

**DELETE** `/api/accounts/:id`

**Response:**

```json
{
  "success": true,
  "message": "Account deleted successfully",
  "account": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false
  }
}
```

### 9. Get Account Statistics

**GET** `/api/accounts/stats`

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalAccounts": 150,
    "roleStats": {
      "Customer": 120,
      "Manager": 25,
      "Owner": 5
    },
    "recentAccounts": 10
  }
}
```

### 10. Check Account Exists

**GET** `/api/accounts/check/:address`

**Example:**

```bash
GET /api/accounts/check/0x1234567890123456789012345678901234567890
```

**Response:**

```json
{
  "success": true,
  "exists": true,
  "account": {
    "_id": "507f1f77bcf86cd799439011",
    "address": "0x1234...",
    "name": "John Doe",
    "role": "Customer"
  }
}
```

## Error Responses

### Validation Error (400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "address",
      "message": "Invalid Ethereum address format"
    }
  ]
}
```

### Not Found (404)

```json
{
  "error": "Account not found",
  "accountId": "507f1f77bcf86cd799439011"
}
```

### Duplicate Address (409)

```json
{
  "message": "Address already exists",
  "field": "address"
}
```

### Server Error (500)

```json
{
  "error": "Server error",
  "message": "Database connection failed"
}
```

## Validation Rules

### Address

- Required
- Must be valid Ethereum address format (0x + 40 hex characters)
- Must be unique

### Name

- Required
- 2-50 characters
- Trimmed whitespace

### Role

- Optional (defaults to "Customer")
- Must be one of: "Customer", "Manager", "Owner"

### Pagination

- Page: Positive integer (default: 1)
- Limit: 1-100 (default: 10)

## Blockchain Integration

### Manager Role

- Automatically added to blockchain manager list
- Can manage shipments and accounts

### Customer Role

- Automatically added to whitelist
- Can create and track shipments

### Owner Role

- Full system access
- Can manage all accounts and system settings

## Usage Examples

### Create a Customer Account

```bash
curl -X POST http://localhost:4000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890123456789012345678901234567890",
    "name": "Alice Johnson",
    "role": "Customer"
  }'
```

### Get All Managers

```bash
curl "http://localhost:4000/api/accounts/role/Manager?page=1&limit=10"
```

### Deactivate Account

```bash
curl -X PATCH http://localhost:4000/api/accounts/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

### Search Accounts

```bash
curl "http://localhost:4000/api/accounts?search=alice&role=Customer"
```

## Notes

1. **Soft Delete**: Accounts are not permanently deleted, just marked as inactive
2. **Blockchain Sync**: Role changes are synced with blockchain automatically
3. **Validation**: All inputs are validated before processing
4. **Pagination**: All list endpoints support pagination
5. **Search**: Case-insensitive search by name or address
6. **Performance**: Database indexes optimize query performance
