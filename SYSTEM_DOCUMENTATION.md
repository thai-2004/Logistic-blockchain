# 📦 Logistics Blockchain System - Tài Liệu Tổng Quan

## 📋 Mục Lục

1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
3. [Tech Stack](#tech-stack)
4. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
5. [Smart Contracts](#smart-contracts)
6. [Backend API](#backend-api)
7. [Frontend Components](#frontend-components)
8. [Tính Năng Chính](#tính-năng-chính)
9. [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
10. [Cấu Hình Môi Trường](#cấu-hình-môi-trường)
11. [Deployment](#deployment)
12. [Security Features](#security-features)
13. [Performance Optimization](#performance-optimization)
14. [Testing](#testing)
15. [Roadmap & Future Improvements](#roadmap--future-improvements)

---

## 🎯 Tổng Quan Hệ Thống

**Logistics Blockchain System** là một hệ thống quản lý logistics phi tập trung sử dụng công nghệ blockchain (Ethereum) để theo dõi và quản lý vận đơn một cách minh bạch, bất biến và an toàn.

### Mục Tiêu

- **Minh Bạch**: Tất cả thông tin vận đơn được lưu trữ trên blockchain, không thể thay đổi
- **Bảo Mật**: Sử dụng smart contracts để đảm bảo tính toàn vẹn dữ liệu
- **Hiệu Quả**: Tự động hóa quy trình quản lý vận đơn
- **Theo Dõi Real-time**: Cập nhật trạng thái và vị trí vận đơn theo thời gian thực

### Đối Tượng Sử Dụng

- **Customer**: Tạo và theo dõi vận đơn của mình
- **Manager**: Quản lý vận đơn, gán tài xế, cập nhật trạng thái
- **Owner**: Quản trị toàn bộ hệ thống, quản lý tài khoản và cấu hình

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Customer   │  │   Manager    │  │    Owner     │      │
│  │  Dashboard   │  │   Dashboard  │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API
┌───────────────────────▼─────────────────────────────────────┐
│              Backend API (Express.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Account    │  │  Shipment    │  │  Blockchain  │      │
│  │  Controller  │  │  Controller  │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────┬──────────────────────┬──────────────────────────┘
            │                      │
    ┌───────▼──────┐      ┌────────▼─────────┐
    │   MongoDB    │      │  Ethereum        │
    │  Database    │      │  Blockchain      │
    │              │      │  (Smart Contract)│
    └──────────────┘      └──────────────────┘
```

### Luồng Dữ Liệu

1. **Tạo Vận Đơn**: Customer tạo vận đơn → Backend → Smart Contract → Blockchain
2. **Cập Nhật Trạng Thái**: Manager cập nhật → Backend → Smart Contract → Blockchain
3. **Theo Dõi**: Frontend → Backend → MongoDB + Blockchain → Hiển thị

---

## 💻 Tech Stack

### Frontend

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.6
- **HTTP Client**: Axios 1.12.2
- **QR Code**: qrcode.react 4.2.0
- **State Management**: React Context API
- **Form Validation**: Custom Hook (useForm)
- **UI/UX**: Custom CSS với modern design

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 4.21.1
- **Database**: MongoDB với Mongoose 8.8.0
- **Blockchain**: Ethers.js 6.13.2
- **Security**: Helmet 7.1.0, CORS 2.8.5
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Validation**: express-validator 7.0.1
- **Logging**: Morgan 1.10.0

### Blockchain

- **Network**: Ethereum (Hardhat Local / Sepolia Testnet)
- **Smart Contract**: Solidity 0.8.28
- **Development**: Hardhat 2.22.6
- **Testing**: Mocha, Chai
- **Type Safety**: TypeScript 5.5.4

### DevOps & Tools

- **Package Manager**: npm
- **Version Control**: Git
- **Environment**: dotenv

---

## 📁 Cấu Trúc Dự Án

```
logistics-blockchain/
├── contracts/                 # Smart Contracts
│   └── Shipment.sol          # ShipmentTracking contract
├── backend/                  # Backend API
│   ├── abi/                  # Contract ABI
│   ├── config/               # Configuration files
│   │   ├── blockchain.js     # Blockchain connection
│   │   ├── db.js             # MongoDB connection
│   │   └── logger.js         # Logging config
│   ├── controllers/          # Route controllers
│   │   ├── accountController.js
│   │   └── shipmentController.js
│   ├── middleware/           # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/               # Mongoose models
│   │   ├── accountModel.js
│   │   ├── shipmentModel.js
│   │   └── userModel.js
│   ├── routes/               # API routes
│   │   ├── accountRoutes.js
│   │   └── shipmentRoutes.js
│   ├── utils/                # Utility functions
│   │   ├── blockchain.js
│   │   └── helpers.js
│   ├── validators/           # Input validators
│   │   ├── account.validator.js
│   │   └── shipment.validator.js
│   └── index.js             # Server entry point
├── frontend/                 # Frontend React App
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   │   ├── styles/      # CSS files
│   │   │   ├── icon/
│   │   │   └── image/
│   │   ├── components/      # React components
│   │   │   ├── CreateShipment.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ModernDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── ShipmentList.jsx
│   │   │   └── ...
│   │   ├── contexts/        # React Contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/           # Custom hooks
│   │   │   ├── useForm.js
│   │   │   └── useShipments.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Public assets
│   └── vite.config.js       # Vite configuration
├── scripts/                  # Deployment scripts
│   ├── deploy.js            # Deploy to testnet
│   ├── deploy-local.js      # Deploy to local network
│   └── copy-abi.js          # Copy ABI to backend
├── test/                     # Tests
│   └── ShipmentTracking.test.js
├── hardhat.config.ts         # Hardhat configuration
├── package.json              # Root dependencies
└── README.md                 # Project README
```

---

## 🔐 Smart Contracts

### ShipmentTracking Contract

**File**: `contracts/Shipment.sol`

#### Chức Năng Chính

1. **Quản Lý Vận Đơn**

   - Tạo vận đơn mới
   - Cập nhật trạng thái (Created → Assigned → Departed → In Transit → Delivered/Failed)
   - Thêm checkpoint (vị trí GPS)

2. **Phân Quyền**

   - Owner: Quản trị toàn bộ hệ thống
   - Manager: Quản lý vận đơn, cập nhật trạng thái
   - Customer: Tạo và xem vận đơn

3. **Whitelist & Phí**
   - Whitelist customers (có thể bật/tắt)
   - Phí tạo vận đơn (có thể bật/tắt)
   - Thu và rút phí

#### Cấu Trúc Dữ Liệu

```solidity
struct Shipment {
    uint256 id;
    string productName;
    string driverName;
    string vehiclePlate;
    string origin;
    string destination;
    Status status;
    address customer;
    address manager;
    uint256 createdAt;
    uint256 updatedAt;
}

struct Checkpoint {
    string label;
    int32 latE6;      // Latitude * 1e6
    int32 lngE6;      // Longitude * 1e6
    uint256 timestamp;
}

enum Status {
    Created,
    Assigned,
    Departed,
    InTransit,
    Delivered,
    Failed
}
```

#### Events

- `ShipmentCreated`: Khi vận đơn được tạo
- `ShipmentAssigned`: Khi vận đơn được gán tài xế
- `StatusUpdated`: Khi trạng thái thay đổi
- `CheckpointAdded`: Khi thêm checkpoint mới
- `CustomerWhitelisted`: Khi customer được thêm vào whitelist
- `FeesWithdrawn`: Khi phí được rút

#### Security Features

- Modifiers: `onlyOwner`, `onlyManager`, `canCreateShipment`
- Input validation: Kiểm tra dữ liệu đầu vào
- State transition validation: Đảm bảo chuyển trạng thái hợp lệ

---

## 🔌 Backend API

### Base URL

```
http://localhost:4000/api
```

### Account Management API

**Base Path**: `/api/accounts`

#### Endpoints

| Method | Endpoint                     | Mô Tả                                   |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | `/accounts`                  | Lấy danh sách tài khoản (có pagination) |
| GET    | `/accounts/:id`              | Lấy tài khoản theo ID                   |
| GET    | `/accounts/address/:address` | Lấy tài khoản theo địa chỉ Ethereum     |
| GET    | `/accounts/role/:role`       | Lấy tài khoản theo role                 |
| POST   | `/accounts`                  | Tạo tài khoản mới                       |
| PUT    | `/accounts/:id`              | Cập nhật tài khoản                      |
| PATCH  | `/accounts/:id/status`       | Bật/tắt trạng thái tài khoản            |
| DELETE | `/accounts/:id`              | Xóa tài khoản (soft delete)             |
| GET    | `/accounts/stats`            | Thống kê tài khoản                      |
| GET    | `/accounts/check/:address`   | Kiểm tra tài khoản tồn tại              |

**Chi tiết**: Xem `backend/API_DOCUMENTATION.md`

### Shipment Management API

**Base Path**: `/api/shipments`

#### Endpoints

| Method | Endpoint                        | Mô Tả                                         |
| ------ | ------------------------------- | --------------------------------------------- |
| GET    | `/shipments`                    | Lấy danh sách vận đơn (có pagination, filter) |
| GET    | `/shipments/:id`                | Lấy vận đơn theo ID                           |
| POST   | `/shipments`                    | Tạo vận đơn mới (tích hợp blockchain)         |
| PUT    | `/shipments/:id/status`         | Cập nhật trạng thái vận đơn                   |
| DELETE | `/shipments/:id`                | Xóa vận đơn                                   |
| GET    | `/shipments/stats`              | Thống kê vận đơn                              |
| GET    | `/shipments/search`             | Tìm kiếm vận đơn nâng cao                     |
| GET    | `/shipments/customer/:customer` | Lấy vận đơn theo customer                     |
| GET    | `/shipments/status/:status`     | Lấy vận đơn theo trạng thái                   |
| GET    | `/shipments/:id/tracking`       | Theo dõi vận đơn với timeline                 |
| GET    | `/shipments/count`              | Đếm số lượng vận đơn trên blockchain          |

**Chi tiết**: Xem `backend/SHIPMENT_API_DOCUMENTATION.md`

### Response Format

#### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

#### Error Response

```json
{
  "error": "Error type",
  "message": "Error description",
  "details": [ ... ]
}
```

### Authentication

Hiện tại hệ thống sử dụng JWT token (lưu trong localStorage). Token được gửi trong header:

```
Authorization: Bearer <token>
```

---

## 🎨 Frontend Components

### Core Components

#### 1. **Login** (`components/Login.jsx`)

- Đăng nhập/Đăng ký
- Form validation với `useForm` hook
- Toast notifications
- Hỗ trợ MetaMask wallet

#### 2. **ModernDashboard** (`components/ModernDashboard.jsx`)

- Dashboard cho Customer
- Tabs: Dashboard, Shipments, Create, Analytics
- Stats cards: Total, In Transit, Delivered
- Recent shipments list
- Quick actions

#### 3. **OwnerDashboard** (`components/OwnerDashboard.jsx`)

- Dashboard cho Owner
- Quản lý accounts, shipments, managers
- System settings (whitelist, fees)
- Analytics và reports

#### 4. **CreateShipment** (`components/CreateShipment.jsx`)

- Form tạo vận đơn
- Validation với `useForm`
- Tích hợp blockchain
- Toast notifications

#### 5. **ShipmentList** (`components/ShipmentList.jsx`)

- Danh sách vận đơn với pagination
- Filter theo status, customer
- Search functionality
- QR code generation

#### 6. **TrackShipment** (`components/TrackShipment.jsx`)

- Theo dõi vận đơn real-time
- Timeline hiển thị trạng thái
- Checkpoint map (nếu có)

### Contexts

#### 1. **AuthContext** (`contexts/AuthContext.jsx`)

- Quản lý authentication state
- User information
- Login/logout functions

#### 2. **ToastContext** (`contexts/ToastContext.jsx`)

- Toast notification system
- Methods: `success`, `error`, `info`, `warning`
- Auto-dismiss với configurable duration

### Custom Hooks

#### 1. **useForm** (`hooks/useForm.js`)

- Form validation hook
- Validation rules: required, pattern, minLength, maxLength, email, custom
- Touch tracking
- Error handling

#### 2. **useShipments** (`hooks/useShipments.js`)

- Fetch shipments với filters
- Auto-refetch
- Loading và error states

### Services

#### **api.js** (`services/api.js`)

- Axios instance với interceptors
- Account APIs
- Shipment APIs
- Token management

---

## ✨ Tính Năng Chính

### 1. Quản Lý Vận Đơn

- ✅ Tạo vận đơn mới (tích hợp blockchain)
- ✅ Cập nhật trạng thái vận đơn
- ✅ Gán tài xế và phương tiện
- ✅ Thêm checkpoint (GPS location)
- ✅ Theo dõi vận đơn real-time
- ✅ Tìm kiếm và lọc vận đơn
- ✅ QR code cho vận đơn

### 2. Quản Lý Tài Khoản

- ✅ Đăng ký/Đăng nhập
- ✅ Phân quyền (Customer, Manager, Owner)
- ✅ Quản lý tài khoản (CRUD)
- ✅ Whitelist customers
- ✅ Thống kê tài khoản

### 3. Dashboard & Analytics

- ✅ Dashboard cho Customer
- ✅ Dashboard cho Owner
- ✅ Thống kê vận đơn
- ✅ Thống kê tài khoản
- ✅ Recent shipments
- ✅ Quick actions

### 4. Blockchain Integration

- ✅ Smart contract deployment
- ✅ Tạo vận đơn trên blockchain
- ✅ Cập nhật trạng thái trên blockchain
- ✅ Thêm checkpoint trên blockchain
- ✅ Whitelist management
- ✅ Fee collection và withdrawal

### 5. User Experience

- ✅ Modern, responsive UI
- ✅ Toast notifications
- ✅ Form validation với error messages
- ✅ Loading states
- ✅ Error handling
- ✅ Lazy loading components
- ✅ Performance optimization

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js >= 18.x
- npm >= 9.x
- MongoDB >= 6.x
- Git

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd logistics-blockchain
```

### Bước 2: Cài Đặt Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Bước 3: Cấu Hình Môi Trường

Tạo file `.env` ở root và `backend/.env` (xem [Cấu Hình Môi Trường](#cấu-hình-môi-trường))

### Bước 4: Khởi Chạy Blockchain Local Network

```bash
# Terminal 1: Start Hardhat node
npm run node
```

### Bước 5: Deploy Smart Contract

```bash
# Terminal 2: Compile và deploy
npm run compile
npm run deploy:local
```

Copy contract address vào `.env` file.

### Bước 6: Khởi Chạy Backend

```bash
# Terminal 3
cd backend
npm run server
```

Backend sẽ chạy tại `http://localhost:4000`

### Bước 7: Khởi Chạy Frontend

```bash
# Terminal 4
cd frontend
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

### Bước 8: Truy Cập Ứng Dụng

Mở trình duyệt và truy cập: `http://localhost:5173`

---

## ⚙️ Cấu Hình Môi Trường

### Root `.env`

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/logistics

# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Blockchain Configuration (Local)
PRIVATE_KEY=your-ethereum-private-key-here
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=your-deployed-contract-address-here

# Network Configuration (for Sepolia deployment)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
SEPOLIA_PRIVATE_KEY=your-sepolia-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:4000/api
```

### Lưu Ý

- **PRIVATE_KEY**: Phải là private key của account có ETH để deploy và tương tác với contract
- **CONTRACT_ADDRESS**: Được tạo sau khi deploy contract
- **JWT_SECRET**: Nên là chuỗi ngẫu nhiên dài và phức tạp
- **MONGODB_URI**: Đảm bảo MongoDB đang chạy

---

## 🌐 Deployment

### Deploy Smart Contract lên Sepolia Testnet

1. Cấu hình `.env` với Sepolia RPC URL và private key
2. Đảm bảo account có Sepolia ETH
3. Deploy:

```bash
npm run deploy:sepolia
```

4. Copy contract address vào `.env`

### Deploy Backend

1. Setup MongoDB (MongoDB Atlas hoặc self-hosted)
2. Cấu hình environment variables
3. Deploy lên server (Heroku, AWS, DigitalOcean, etc.)

```bash
cd backend
npm install --production
npm start
```

### Deploy Frontend

1. Build production:

```bash
cd frontend
npm run build
```

2. Deploy `dist/` folder lên hosting (Vercel, Netlify, etc.)
3. Cấu hình `VITE_API_URL` trỏ đến backend API

---

## 🔒 Security Features

### Backend

- ✅ **Helmet**: Security headers
- ✅ **CORS**: Cross-origin resource sharing configuration
- ✅ **Input Validation**: express-validator cho tất cả inputs
- ✅ **JWT Authentication**: Token-based authentication
- ✅ **Error Handling**: Centralized error handling middleware
- ✅ **Rate Limiting**: (Có thể thêm)
- ✅ **SQL Injection Protection**: Mongoose ODM tự động escape

### Smart Contract

- ✅ **Access Control**: Modifiers (onlyOwner, onlyManager)
- ✅ **Input Validation**: Kiểm tra dữ liệu đầu vào
- ✅ **State Transition Validation**: Đảm bảo chuyển trạng thái hợp lệ
- ✅ **Reentrancy Protection**: (Có thể thêm nếu cần)

### Frontend

- ✅ **Protected Routes**: Route guards với ProtectedRoute component
- ✅ **Token Management**: Secure token storage và auto-refresh
- ✅ **Input Sanitization**: Form validation
- ✅ **XSS Protection**: React tự động escape

---

## ⚡ Performance Optimization

### Frontend

1. **Code Splitting**

   - Lazy loading cho ModernDashboard và OwnerDashboard
   - React.lazy() và Suspense

2. **Memoization**

   - React.memo cho components
   - useMemo cho computed values
   - useCallback cho event handlers

3. **Optimized Rendering**
   - Conditional rendering
   - Key props cho lists
   - Virtual scrolling (có thể thêm cho large lists)

### Backend

1. **Database Optimization**

   - Indexes trên các fields thường query
   - Pagination cho tất cả list endpoints
   - Query optimization

2. **Caching**

   - (Có thể thêm Redis cho caching)

3. **API Optimization**
   - Batch requests khi có thể
   - Compression middleware

### Blockchain

1. **Gas Optimization**
   - Solidity compiler optimization (runs: 200)
   - Batch operations (addToWhitelistBatch)
   - Efficient data structures

---

## 🧪 Testing

### Smart Contract Tests

```bash
npm test
```

Tests được viết bằng Mocha và Chai, test các chức năng của smart contract.

### Manual Testing

1. **Account Management**

   - Tạo account mới
   - Đăng nhập
   - Cập nhật thông tin

2. **Shipment Management**

   - Tạo vận đơn
   - Cập nhật trạng thái
   - Theo dõi vận đơn

3. **Blockchain Integration**
   - Verify transactions trên blockchain
   - Check events
   - Verify data integrity

---

## 🗺️ Roadmap & Future Improvements

### Phase 1: Core Features ✅

- [x] Smart contract development
- [x] Backend API
- [x] Frontend UI
- [x] Authentication
- [x] Basic shipment management

### Phase 2: Enhanced Features ✅

- [x] Toast notifications
- [x] Form validation
- [x] Performance optimization
- [x] Error handling
- [x] Dashboard analytics

### Phase 3: Advanced Features (Planned)

- [ ] Real-time GPS tracking
- [ ] Mobile app (React Native)
- [ ] Email/SMS notifications
- [ ] Advanced analytics với charts
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export reports (PDF, Excel)

### Phase 4: Enterprise Features (Future)

- [ ] Multi-chain support
- [ ] IPFS integration cho documents
- [ ] Smart contract upgrades
- [ ] Oracle integration (price feeds, weather)
- [ ] Insurance integration
- [ ] Payment gateway integration

### Technical Improvements

- [ ] Unit tests cho frontend
- [ ] Integration tests
- [ ] E2E tests (Cypress/Playwright)
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Monitoring và logging (ELK stack)
- [ ] Performance monitoring (Sentry, New Relic)

---

## 📊 System Statistics

### Codebase Metrics

- **Smart Contracts**: 1 contract, ~400 lines
- **Backend**: ~15 files, ~2000+ lines
- **Frontend**: ~20 components, ~3000+ lines
- **Total**: ~5000+ lines of code

### API Endpoints

- **Account API**: 10 endpoints
- **Shipment API**: 11 endpoints
- **Total**: 21 endpoints

### Components

- **React Components**: 13 components
- **Contexts**: 2 contexts
- **Custom Hooks**: 2 hooks
- **Services**: 1 API service

---

## 📝 Notes

### Known Issues

1. **Duplicate Shipments**: Đã có script cleanup (`backend/scripts/cleanup-duplicates.js`)
2. **Gas Costs**: Cần optimize thêm cho production
3. **Error Messages**: Một số error messages có thể cải thiện

### Best Practices

1. **Code Style**: Tuân thủ ESLint rules
2. **Git**: Commit messages rõ ràng, meaningful
3. **Documentation**: Code comments cho complex logic
4. **Error Handling**: Luôn handle errors gracefully

---

## 📞 Support & Contact

- **Documentation**: Xem các file README trong từng thư mục
- **API Docs**: `backend/API_DOCUMENTATION.md`, `backend/SHIPMENT_API_DOCUMENTATION.md`
- **Frontend Guide**: `frontend/FRONTEND_GUIDE.md`

---

## 📄 License

ISC License

---

**Last Updated**: 2024
**Version**: 1.0.0
