// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ShipmentTracking - Minh bạch vận đơn logistics trên blockchain
/// @notice Demo cho đồ án: Ứng dụng Blockchain trong logistics & vận tải
/// @dev Thêm whitelist customer và phí tạo vận đơn
contract ShipmentTracking {
    // ---- Phân quyền cơ bản ----
    address public owner;
    mapping(address => bool) public managers;

    // ---- Whitelist & Phí ----
    mapping(address => bool) public whitelistedCustomers;
    uint256 public shipmentFee; // Phí tạo vận đơn (wei)
    bool public whitelistEnabled; // Bật/tắt chế độ whitelist
    bool public feeEnabled; // Bật/tắt chế độ phí
    uint256 public collectedFees; // Tổng phí thu được

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyManager() {
        require(managers[msg.sender], "Not manager");
        _;
    }

    // ---- Modifier kiểm tra quyền tạo vận đơn ----
    modifier canCreateShipment() {
        // Nếu bật whitelist, phải nằm trong danh sách
        if (whitelistEnabled) {
            require(
                whitelistedCustomers[msg.sender] || managers[msg.sender],
                "Not whitelisted"
            );
        }

        // Nếu bật phí, phải gửi đủ ETH
        if (feeEnabled) {
            require(msg.value >= shipmentFee, "Insufficient fee");
        }
        _;
    }

    // ---- Mô hình trạng thái ----
    enum Status {
        Created,
        Assigned,
        Departed,
        InTransit,
        Delivered,
        Failed
    }

    // ---- Dữ liệu vận đơn ----
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
        int32 latE6;
        int32 lngE6;
        uint256 timestamp;
    }

    // ---- Lưu trữ ----
    uint256 private _shipmentCount;
    mapping(uint256 => Shipment) private _shipments;
    mapping(uint256 => Checkpoint[]) private _checkpoints;

    // ---- Sự kiện ----
    event ManagerAdded(address indexed account);
    event ManagerRemoved(address indexed account);

    // Events cho whitelist & phí
    event CustomerWhitelisted(address indexed customer);
    event CustomerRemovedFromWhitelist(address indexed customer);
    event ShipmentFeeUpdated(uint256 newFee);
    event WhitelistToggled(bool enabled);
    event FeeToggled(bool enabled);
    event FeesWithdrawn(address indexed to, uint256 amount);

    event ShipmentCreated(
        uint256 indexed id,
        address indexed customer,
        string productName,
        string origin,
        string destination
    );
    event ShipmentAssigned(
        uint256 indexed id,
        address indexed manager,
        string driverName,
        string vehiclePlate
    );
    event StatusUpdated(
        uint256 indexed id,
        Status newStatus,
        address indexed actor
    );
    event CheckpointAdded(
        uint256 indexed id,
        string label,
        int32 latE6,
        int32 lngE6
    );

    // ---- Khởi tạo ----
    constructor() {
        owner = msg.sender;
        managers[msg.sender] = true;

        // Cấu hình mặc định
        whitelistEnabled = false; // Tắt whitelist ban đầu
        feeEnabled = false; // Tắt phí ban đầu
        shipmentFee = 0.001 ether; // Phí mặc định: 0.001 ETH

        emit ManagerAdded(msg.sender);
    }

    // ---- Quản lý Whitelist ----

    /// @notice Thêm customer vào whitelist
    function addToWhitelist(address customer) external onlyOwner {
        require(customer != address(0), "Invalid address");
        whitelistedCustomers[customer] = true;
        emit CustomerWhitelisted(customer);
    }

    /// @notice Thêm nhiều customer vào whitelist (tiết kiệm gas)
    function addToWhitelistBatch(
        address[] calldata customers
    ) external onlyOwner {
        for (uint256 i = 0; i < customers.length; i++) {
            require(customers[i] != address(0), "Invalid address");
            whitelistedCustomers[customers[i]] = true;
            emit CustomerWhitelisted(customers[i]);
        }
    }

    /// @notice Xóa customer khỏi whitelist
    function removeFromWhitelist(address customer) external onlyOwner {
        whitelistedCustomers[customer] = false;
        emit CustomerRemovedFromWhitelist(customer);
    }

    /// @notice Bật/tắt chế độ whitelist
    function toggleWhitelist(bool enabled) external onlyOwner {
        whitelistEnabled = enabled;
        emit WhitelistToggled(enabled);
    }

    // ---- THÊM MỚI: Quản lý Phí ----

    /// @notice Cập nhật phí tạo vận đơn
    function setShipmentFee(uint256 newFee) external onlyOwner {
        shipmentFee = newFee;
        emit ShipmentFeeUpdated(newFee);
    }

    /// @notice Bật/tắt chế độ phí
    function toggleFee(bool enabled) external onlyOwner {
        feeEnabled = enabled;
        emit FeeToggled(enabled);
    }

    /// @notice Rút phí đã thu về
    function withdrawFees() external onlyOwner {
        uint256 amount = collectedFees;
        require(amount > 0, "No fees to withdraw");

        collectedFees = 0;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");

        emit FeesWithdrawn(owner, amount);
    }

    /// @notice Kiểm tra số dư phí
    function getCollectedFees() external view returns (uint256) {
        return collectedFees;
    }

    // ---- Quản trị quyền ----
    function addManager(address account) external onlyOwner {
        managers[account] = true;
        emit ManagerAdded(account);
    }

    function removeManager(address account) external onlyOwner {
        managers[account] = false;
        emit ManagerRemoved(account);
    }

    // ---- Tạo vận đơn (Customer gọi) ----
    /// @notice Tạo vận đơn mới - CẬP NHẬT: Thêm payable và modifier
    function createShipment(
        string calldata productName,
        string calldata origin,
        string calldata destination
    ) external payable canCreateShipment returns (uint256) {
        require(bytes(productName).length > 0, "productName required");

        // Nếu bật phí, thu phí và hoàn lại thừa
        if (feeEnabled && msg.value > shipmentFee) {
            collectedFees += shipmentFee;
            uint256 refund = msg.value - shipmentFee;
            (bool success, ) = msg.sender.call{value: refund}("");
            require(success, "Refund failed");
        } else if (feeEnabled) {
            collectedFees += msg.value;
        }

        _shipmentCount += 1;
        uint256 id = _shipmentCount;

        _shipments[id] = Shipment({
            id: id,
            productName: productName,
            driverName: "",
            vehiclePlate: "",
            origin: origin,
            destination: destination,
            status: Status.Created,
            customer: msg.sender,
            manager: address(0),
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        emit ShipmentCreated(id, msg.sender, productName, origin, destination);
        return id;
    }

    // ---- Gán tài xế/phương tiện (Manager) ----
    function assignShipment(
        uint256 id,
        string calldata driverName,
        string calldata vehiclePlate
    ) external onlyManager {
        Shipment storage s = _requireShipment(id);
        require(
            s.status == Status.Created || s.status == Status.Assigned,
            "Bad status"
        );
        s.driverName = driverName;
        s.vehiclePlate = vehiclePlate;
        s.manager = msg.sender;
        s.status = Status.Assigned;
        s.updatedAt = block.timestamp;

        emit ShipmentAssigned(id, msg.sender, driverName, vehiclePlate);
        emit StatusUpdated(id, Status.Assigned, msg.sender);
    }

    // ---- Cập nhật trạng thái (Manager) ----
    function updateStatus(uint256 id, Status newStatus) external onlyManager {
        Shipment storage s = _requireShipment(id);
        require(
            s.status != Status.Delivered && s.status != Status.Failed,
            "Already final"
        );

        if (newStatus != Status.Failed) {
            require(
                _isForwardTransition(s.status, newStatus),
                "Invalid transition"
            );
        }

        s.status = newStatus;
        s.manager = msg.sender;
        s.updatedAt = block.timestamp;

        emit StatusUpdated(id, newStatus, msg.sender);
    }

    // ---- Thêm checkpoint (Manager) ----
    function addCheckpoint(
        uint256 id,
        string calldata label,
        int32 latE6,
        int32 lngE6
    ) external onlyManager {
        _requireShipment(id);
        _checkpoints[id].push(
            Checkpoint({
                label: label,
                latE6: latE6,
                lngE6: lngE6,
                timestamp: block.timestamp
            })
        );
        emit CheckpointAdded(id, label, latE6, lngE6);
    }

    // ---- Đọc dữ liệu ----
    function getShipment(
        uint256 id
    )
        external
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            Status,
            address,
            address,
            uint256,
            uint256
        )
    {
        Shipment memory s = _shipments[id];
        require(s.id != 0, "Not found");
        return (
            s.id,
            s.productName,
            s.driverName,
            s.vehiclePlate,
            s.origin,
            s.destination,
            s.status,
            s.customer,
            s.manager,
            s.createdAt,
            s.updatedAt
        );
    }

    function getShipmentCount() external view returns (uint256) {
        return _shipmentCount;
    }

    function getCheckpointCount(uint256 id) external view returns (uint256) {
        return _checkpoints[id].length;
    }

    function getCheckpoint(
        uint256 id,
        uint256 index
    ) external view returns (string memory, int32, int32, uint256) {
        require(index < _checkpoints[id].length, "Index OOB");
        Checkpoint memory c = _checkpoints[id][index];
        return (c.label, c.latE6, c.lngE6, c.timestamp);
    }

    function getCheckpoints(
        uint256 id
    ) external view returns (Checkpoint[] memory) {
        return _checkpoints[id];
    }

    // ---- Hàm hỗ trợ ----
    function _requireShipment(
        uint256 id
    ) internal view returns (Shipment storage) {
        Shipment storage s = _shipments[id];
        require(s.id != 0, "Shipment not found");
        return s;
    }

    function _isForwardTransition(
        Status fromS,
        Status toS
    ) internal pure returns (bool) {
        if (uint8(toS) <= uint8(fromS)) return false;
        if (toS == Status.Failed) return false;
        return true;
    }

    // ---- Nhận ETH (nếu có ai gửi nhầm) ----
    receive() external payable {
        collectedFees += msg.value;
    }
}
