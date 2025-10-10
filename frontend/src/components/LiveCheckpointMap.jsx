import React, { useState } from 'react';

const LiveCheckpointMap = () => {
  const [checkpoints] = useState([
    {
      id: 1,
      name: 'Kho hàng Hà Nội',
      address: '123 Đường ABC, Quận 1, Hà Nội',
      lat: 21.0285,
      lng: 105.8542,
      status: 'active',
      shipments: 15
    },
    {
      id: 2,
      name: 'Trung tâm phân phối TP.HCM',
      address: '456 Đường XYZ, Quận 7, TP.HCM',
      lat: 10.7769,
      lng: 106.7009,
      status: 'active',
      shipments: 23
    },
    {
      id: 3,
      name: 'Kho hàng Đà Nẵng',
      address: '789 Đường DEF, Quận Hải Châu, Đà Nẵng',
      lat: 16.0544,
      lng: 108.2022,
      status: 'maintenance',
      shipments: 8
    }
  ]);

  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);

  return (
    <div className="live-checkpoint-map">
      <div className="map-header">
        <h2>🗺️ Bản đồ Checkpoint</h2>
        <p>Theo dõi vị trí các checkpoint và trạng thái hoạt động</p>
      </div>

      <div className="map-container">
        <div className="map-content">
          <div className="map-placeholder">
            <div className="map-icon">🗺️</div>
            <h3>Bản đồ tương tác</h3>
            <p>Hiển thị vị trí các checkpoint trên bản đồ</p>
            <div className="map-stats">
              <div className="stat">
                <span className="stat-number">{checkpoints.length}</span>
                <span className="stat-label">Checkpoint</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {checkpoints.reduce((sum, cp) => sum + cp.shipments, 0)}
                </span>
                <span className="stat-label">Shipments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="checkpoint-list">
          <h3>Danh sách Checkpoint</h3>
          <div className="checkpoint-items">
            {checkpoints.map(checkpoint => (
              <div 
                key={checkpoint.id}
                className={`checkpoint-item ${selectedCheckpoint?.id === checkpoint.id ? 'selected' : ''}`}
                onClick={() => setSelectedCheckpoint(checkpoint)}
              >
                <div className="checkpoint-header">
                  <div className="checkpoint-name">{checkpoint.name}</div>
                  <div className={`status-badge ${checkpoint.status}`}>
                    {checkpoint.status === 'active' ? '🟢 Hoạt động' : '🔧 Bảo trì'}
                  </div>
                </div>
                <div className="checkpoint-address">{checkpoint.address}</div>
                <div className="checkpoint-stats">
                  <span>📍 {checkpoint.lat}, {checkpoint.lng}</span>
                  <span>📦 {checkpoint.shipments} shipments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCheckpoint && (
        <div className="checkpoint-details">
          <h3>Chi tiết Checkpoint</h3>
          <div className="details-content">
            <div className="detail-row">
              <span className="label">Tên:</span>
              <span className="value">{selectedCheckpoint.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">{selectedCheckpoint.address}</span>
            </div>
            <div className="detail-row">
              <span className="label">Tọa độ:</span>
              <span className="value">{selectedCheckpoint.lat}, {selectedCheckpoint.lng}</span>
            </div>
            <div className="detail-row">
              <span className="label">Trạng thái:</span>
              <span className={`value status-${selectedCheckpoint.status}`}>
                {selectedCheckpoint.status === 'active' ? '🟢 Hoạt động' : '🔧 Bảo trì'}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Số shipments:</span>
              <span className="value">{selectedCheckpoint.shipments}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .live-checkpoint-map {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .map-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .map-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .map-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .map-content {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          border: 2px dashed #dee2e6;
        }

        .map-placeholder {
          text-align: center;
          padding: 40px 20px;
        }

        .map-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .map-stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }

        .stat-label {
          font-size: 14px;
          color: #6c757d;
        }

        .checkpoint-list {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .checkpoint-list h3 {
          margin-bottom: 15px;
          color: #2c3e50;
        }

        .checkpoint-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .checkpoint-item {
          padding: 15px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkpoint-item:hover {
          background: #f8f9fa;
          border-color: #007bff;
        }

        .checkpoint-item.selected {
          background: #e3f2fd;
          border-color: #007bff;
        }

        .checkpoint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .checkpoint-name {
          font-weight: bold;
          color: #2c3e50;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.maintenance {
          background: #fff3cd;
          color: #856404;
        }

        .checkpoint-address {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 8px;
        }

        .checkpoint-stats {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #6c757d;
        }

        .checkpoint-details {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .checkpoint-details h3 {
          margin-bottom: 15px;
          color: #2c3e50;
        }

        .details-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f1f3f4;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: bold;
          color: #495057;
        }

        .value {
          color: #6c757d;
        }

        .status-active {
          color: #28a745;
        }

        .status-maintenance {
          color: #ffc107;
        }

        @media (max-width: 768px) {
          .map-container {
            grid-template-columns: 1fr;
          }
          
          .map-stats {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveCheckpointMap;
