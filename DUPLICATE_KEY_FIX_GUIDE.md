# Hướng dẫn Fix Lỗi Duplicate Key Error

## Vấn đề

Khi tạo shipment mới, bạn có thể gặp lỗi:

```
MongoError: E11000 duplicate key error collection: logistics.shipments index: shipmentId_1 dup key: { shipmentId: 1 }
```

## Nguyên nhân

- Có nhiều record trong database với cùng `shipmentId`
- MongoDB có unique index trên field `shipmentId`
- Khi tạo shipment mới với ID đã tồn tại, MongoDB sẽ báo lỗi duplicate key

## Giải pháp

### 1. Sử dụng API Cleanup (Khuyến nghị)

```bash
# Gọi API để xóa duplicate records
curl -X POST http://localhost:5000/api/shipments/cleanup-duplicates
```

### 2. Sử dụng Script Test

```bash
# Test tạo shipment
node scripts/test-create-shipment.js

# Test cleanup duplicates
node scripts/test-cleanup.js
```

### 3. Xử lý thủ công

Nếu cần xử lý thủ công, bạn có thể:

1. **Kiểm tra duplicates:**

```javascript
// Trong MongoDB shell hoặc script
db.shipments.aggregate([
  { $group: { _id: "$shipmentId", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } },
]);
```

2. **Xóa duplicates:**

```javascript
// Giữ lại record cũ nhất, xóa các record mới hơn
db.shipments
  .aggregate([
    { $group: { _id: "$shipmentId", docs: { $push: "$$ROOT" } } },
    { $match: { "docs.1": { $exists: true } } },
  ])
  .forEach(function (group) {
    group.docs.sort({ createdAt: 1 });
    group.docs.slice(1).forEach(function (doc) {
      db.shipments.deleteOne({ _id: doc._id });
    });
  });
```

## Cải tiến Code

### 1. Error Handling được cải thiện

Code đã được cập nhật để xử lý duplicate key error tốt hơn:

```javascript
// Handle duplicate key error specifically
if (err.code === 11000) {
  console.error(
    `Duplicate key error for shipmentId ${shipmentId}:`,
    err.keyPattern
  );

  // Try to find the existing shipment
  const existingShipment = await Shipment.findOne({ shipmentId });
  if (existingShipment) {
    return res.status(409).json({
      error: "Duplicate shipment ID",
      message: "A shipment with this ID already exists",
      existingShipment: {
        shipmentId: existingShipment.shipmentId,
        status: existingShipment.status,
        createdAt: existingShipment.createdAt,
      },
    });
  }
}
```

### 2. API Endpoints mới

- `POST /api/shipments/cleanup-duplicates` - Xóa duplicate records
- Improved error messages cho duplicate key errors

## Phòng ngừa trong tương lai

### 1. Unique Index

Database đã có unique index trên `shipmentId`:

```javascript
shipmentId: { type: Number, required: true, unique: true }
```

### 2. Pre-check trước khi tạo

Code đã có check trước khi tạo:

```javascript
// Check if shipmentId already exists in database
const existingShipment = await Shipment.findOne({ shipmentId });
if (existingShipment) {
  return res.status(409).json({
    error: "Shipment already exists",
    message: `Shipment with ID ${shipmentId} already exists in database`,
  });
}
```

### 3. Blockchain Integration

Shipment ID được lấy từ blockchain, đảm bảo tính duy nhất:

```javascript
const shipmentId = Number(event.args.id);
```

## Troubleshooting

### Nếu vẫn gặp lỗi:

1. Kiểm tra MongoDB connection
2. Chạy cleanup API
3. Restart backend server
4. Kiểm tra blockchain connection

### Logs để debug:

```bash
# Backend logs
npm run dev

# MongoDB logs
mongod --logpath /var/log/mongodb/mongod.log
```

## Test Commands

```bash
# 1. Start backend server
cd backend
npm run dev

# 2. Test create shipment
node scripts/test-create-shipment.js

# 3. Test cleanup duplicates
node scripts/test-cleanup.js

# 4. Test với frontend
cd frontend
npm start
```

## Kết luận

Lỗi duplicate key đã được xử lý với:

- ✅ Improved error handling
- ✅ Cleanup API endpoint
- ✅ Pre-check validation
- ✅ Better error messages
- ✅ Test scripts
