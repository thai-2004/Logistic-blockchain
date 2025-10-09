# Shipment Management API Documentation

## Overview

Complete API documentation for shipment management in the logistics blockchain system.

## Base URL

```
http://localhost:4000/api/shipments
```

## Authentication

Currently no authentication required (for development). In production, implement JWT or OAuth2.

## Shipment Model

```javascript
{
  _id: "ObjectId",
  shipmentId: 1, // Blockchain shipment ID (unique)
  productName: "Electronics",
  origin: "Ho Chi Minh City",
  destination: "Hanoi",
  status: "Created" | "In Transit" | "Delivered" | "Cancelled",
  customer: "0x...", // Customer wallet address
  manager: "Manager Name", // Optional
  driverName: "Driver Name", // Optional
  vehiclePlate: "ABC-123", // Optional
  blockchainTxHash: "0x...", // Blockchain transaction hash
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

### 1. Get All Shipments

**GET** `/api/shipments`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (Created, In Transit, Delivered, Cancelled)
- `customer` (optional): Filter by customer address

**Example:**

```bash
GET /api/shipments?page=1&limit=10&status=In%20Transit&customer=0x1234...
```

**Response:**

```json
{
  "success": true,
  "shipments": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### 2. Get Shipment by ID

**GET** `/api/shipments/:id`

**Example:**

```bash
GET /api/shipments/1
```

**Response:**

```json
{
  "success": true,
  "shipment": {
    "_id": "507f1f77bcf86cd799439011",
    "shipmentId": 1,
    "productName": "Electronics",
    "origin": "Ho Chi Minh City",
    "destination": "Hanoi",
    "status": "In Transit",
    "customer": "0x1234...",
    "manager": "John Manager",
    "driverName": "Alice Driver",
    "vehiclePlate": "ABC-123",
    "blockchainTxHash": "0x...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Shipment

**POST** `/api/shipments`

**Request Body:**

```json
{
  "productName": "Electronics",
  "origin": "Ho Chi Minh City",
  "destination": "Hanoi"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Shipment created successfully",
  "shipment": {
    "_id": "507f1f77bcf86cd799439011",
    "shipmentId": 1,
    "productName": "Electronics",
    "origin": "Ho Chi Minh City",
    "destination": "Hanoi",
    "status": "Created",
    "customer": "0x1234...",
    "blockchainTxHash": "0x...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Shipment

**PUT** `/api/shipments/:id/status`

**Request Body:**

```json
{
  "status": "In Transit",
  "driverName": "Alice Driver",
  "vehiclePlate": "ABC-123",
  "manager": "John Manager"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Shipment updated successfully",
  "shipment": {
    "_id": "507f1f77bcf86cd799439011",
    "shipmentId": 1,
    "status": "In Transit",
    "driverName": "Alice Driver",
    "vehiclePlate": "ABC-123",
    "manager": "John Manager",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Shipment

**DELETE** `/api/shipments/:id`

**Response:**

```json
{
  "success": true,
  "message": "Shipment deleted successfully",
  "shipment": {
    "_id": "507f1f77bcf86cd799439011",
    "shipmentId": 1
  }
}
```

### 6. Get Shipment Statistics

**GET** `/api/shipments/stats`

**Query Parameters:**

- `period` (optional): Time period (all, today, week, month)

**Example:**

```bash
GET /api/shipments/stats?period=week
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalShipments": 150,
    "statusStats": {
      "Created": 20,
      "In Transit": 80,
      "Delivered": 45,
      "Cancelled": 5
    },
    "topCustomers": [
      { "_id": "0x1234...", "count": 25 },
      { "_id": "0x5678...", "count": 20 }
    ],
    "recentShipments": [...]
  }
}
```

### 7. Search Shipments (Advanced)

**GET** `/api/shipments/search`

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `query` (optional): Search term (searches productName, origin, destination, customer)
- `status` (optional): Filter by status
- `customer` (optional): Filter by customer address
- `productName` (optional): Filter by product name
- `origin` (optional): Filter by origin
- `destination` (optional): Filter by destination
- `dateFrom` (optional): Start date (ISO 8601)
- `dateTo` (optional): End date (ISO 8601)

**Example:**

```bash
GET /api/shipments/search?query=electronics&status=In%20Transit&dateFrom=2024-01-01&dateTo=2024-01-31
```

**Response:**

```json
{
  "success": true,
  "shipments": [...],
  "searchParams": {
    "query": "electronics",
    "status": "In Transit",
    "dateFrom": "2024-01-01",
    "dateTo": "2024-01-31"
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10
  }
}
```

### 8. Get Shipments by Customer

**GET** `/api/shipments/customer/:customer`

**Parameters:**

- `customer`: Customer wallet address

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Example:**

```bash
GET /api/shipments/customer/0x1234567890123456789012345678901234567890?page=1&limit=5&status=In%20Transit
```

**Response:**

```json
{
  "success": true,
  "shipments": [...],
  "customer": "0x1234...",
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 8,
    "itemsPerPage": 5
  }
}
```

### 9. Get Shipments by Status

**GET** `/api/shipments/status/:status`

**Parameters:**

- `status`: Created, In Transit, Delivered, or Cancelled

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `customer` (optional): Filter by customer address

**Example:**

```bash
GET /api/shipments/status/In%20Transit?page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "shipments": [...],
  "status": "In Transit",
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalItems": 35,
    "itemsPerPage": 10
  }
}
```

### 10. Get Shipment Tracking

**GET** `/api/shipments/:id/tracking`

**Example:**

```bash
GET /api/shipments/1/tracking
```

**Response:**

```json
{
  "success": true,
  "shipment": {
    "shipmentId": 1,
    "productName": "Electronics",
    "origin": "Ho Chi Minh City",
    "destination": "Hanoi",
    "status": "In Transit",
    "customer": "0x1234...",
    "manager": "John Manager",
    "driverName": "Alice Driver",
    "vehiclePlate": "ABC-123",
    "blockchainTxHash": "0x..."
  },
  "timeline": [
    {
      "status": "Created",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "description": "Shipment created",
      "completed": true
    },
    {
      "status": "In Transit",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "description": "Shipment in transit",
      "completed": true
    }
  ]
}
```

### 11. Get Shipment Count (Blockchain)

**GET** `/api/shipments/count`

**Response:**

```json
{
  "success": true,
  "count": 150
}
```

## Error Responses

### Validation Error (400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "productName",
      "message": "Product name is required"
    }
  ]
}
```

### Not Found (404)

```json
{
  "error": "Shipment not found",
  "shipmentId": "1"
}
```

### Blockchain Error (500)

```json
{
  "error": "Blockchain error",
  "message": "Transaction failed"
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

### Product Name

- Required
- 2-100 characters
- Trimmed whitespace

### Origin/Destination

- Required
- 2-100 characters
- Trimmed whitespace

### Status

- Must be one of: Created, In Transit, Delivered, Cancelled
- Default: Created

### Customer Address

- Required for creation
- Must be valid Ethereum address format (0x + 40 hex characters)

### Driver Name

- Optional
- 2-50 characters
- Trimmed whitespace

### Vehicle Plate

- Optional
- 2-20 characters
- Trimmed whitespace

### Manager

- Optional
- 2-50 characters
- Trimmed whitespace

### Pagination

- Page: Positive integer (default: 1)
- Limit: 1-100 (default: 10)

### Date Filters

- Must be valid ISO 8601 format
- dateFrom: Start date
- dateTo: End date

## Blockchain Integration

### Shipment Creation

- Automatically creates shipment on blockchain
- Returns blockchain transaction hash
- Parses ShipmentCreated event for shipment ID

### Shipment Tracking

- All status changes are tracked
- Blockchain transaction hash is stored
- Timeline shows progression through statuses

## Usage Examples

### Create a Shipment

```bash
curl -X POST http://localhost:4000/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Electronics",
    "origin": "Ho Chi Minh City",
    "destination": "Hanoi"
  }'
```

### Update Shipment Status

```bash
curl -X PUT http://localhost:4000/api/shipments/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Transit",
    "driverName": "Alice Driver",
    "vehiclePlate": "ABC-123"
  }'
```

### Search Shipments

```bash
curl "http://localhost:4000/api/shipments/search?query=electronics&status=In%20Transit&page=1&limit=10"
```

### Get Customer Shipments

```bash
curl "http://localhost:4000/api/shipments/customer/0x1234567890123456789012345678901234567890?page=1&limit=5"
```

### Track Shipment

```bash
curl "http://localhost:4000/api/shipments/1/tracking"
```

### Get Statistics

```bash
curl "http://localhost:4000/api/shipments/stats?period=week"
```

## Notes

1. **Blockchain Integration**: All shipments are created on blockchain
2. **Status Progression**: Created → In Transit → Delivered (or Cancelled)
3. **Search**: Case-insensitive search across multiple fields
4. **Pagination**: All list endpoints support pagination
5. **Validation**: Comprehensive input validation for all endpoints
6. **Performance**: Database indexes optimize query performance
7. **Timeline**: Tracking shows shipment progression with timestamps
8. **Statistics**: Real-time analytics with period filtering
