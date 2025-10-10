# Hướng dẫn Frontend - Logistics Blockchain

## Tổng quan

Frontend đã được cập nhật với hệ thống đăng nhập và phân quyền theo role. Khi truy cập `http://localhost:3000/`, người dùng sẽ thấy trang chủ với các tính năng sau:

## Cấu trúc mới

### 1. Trang chủ (HomePage)

- **URL**: `http://localhost:3000/`
- **Mô tả**: Trang chào mừng với thông tin về hệ thống
- **Tính năng**:
  - Giới thiệu hệ thống logistics blockchain
  - Nút "Đăng nhập để bắt đầu"
  - Hiển thị các tính năng chính

### 2. Trang đăng nhập (Login)

- **Mô tả**: Form đăng nhập với lựa chọn role
- **Tính năng**:
  - Nhập email và mật khẩu
  - Chọn role: Customer hoặc Owner
  - Nút "Quay lại trang chủ"
  - Hiển thị thông tin về quyền của từng role

### 3. Dashboard cho Customer

- **Mô tả**: Giao diện dành cho khách hàng
- **Tính năng**:
  - Chỉ có tab "Theo dõi Shipment"
  - Hiển thị thông tin user (role: Khách hàng)
  - Nút đăng xuất

### 4. Dashboard cho Owner

- **Mô tả**: Giao diện đầy đủ cho chủ sở hữu
- **Tính năng**:
  - Tất cả các tab: Dashboard, Tạo Shipment, Danh sách, Theo dõi, Cập nhật, Shipper Panel, Bản đồ
  - Hiển thị thông tin user (role: Chủ sở hữu) với màu vàng
  - Badge admin với các quyền đặc biệt

## Cách sử dụng

### Đăng nhập với role Customer:

1. Truy cập `http://localhost:3000/`
2. Click "Đăng nhập để bắt đầu"
3. Nhập email và mật khẩu
4. Chọn role "Customer"
5. Click "Đăng nhập"
6. Sẽ được chuyển đến giao diện Customer với chỉ tab "Theo dõi Shipment"

### Đăng nhập với role Owner:

1. Truy cập `http://localhost:3000/`
2. Click "Đăng nhập để bắt đầu"
3. Nhập email và mật khẩu
4. Chọn role "Owner"
5. Click "Đăng nhập"
6. Sẽ được chuyển đến giao diện Owner với đầy đủ tất cả chức năng

## Lưu trữ session

- Thông tin đăng nhập được lưu trong localStorage
- Khi refresh trang, hệ thống sẽ tự động đăng nhập lại
- Để đăng xuất, click nút "Đăng xuất" ở góc phải

## Responsive Design

- Tất cả các component đều responsive
- Hỗ trợ mobile và desktop
- Navigation tự động điều chỉnh theo kích thước màn hình

## File structure

```
frontend/src/
├── components/
│   ├── HomePage.jsx          # Trang chủ
│   ├── HomePage.css
│   ├── Login.jsx             # Form đăng nhập
│   ├── Login.css
│   ├── CustomerDashboard.jsx  # Dashboard cho Customer
│   ├── CustomerDashboard.css
│   ├── OwnerDashboard.jsx     # Dashboard cho Owner
│   ├── OwnerDashboard.css
│   └── ... (các component khác)
├── hooks/
│   └── useShipments.js       # Hook quản lý shipments
└── App.jsx                   # Component chính với routing
```

## Lưu ý

- Hệ thống sử dụng mock authentication (không kết nối API thật)
- Mọi email/password đều có thể đăng nhập được
- Role được lưu trong localStorage và persist qua các session
