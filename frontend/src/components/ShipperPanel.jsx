import React, { useState } from 'react';

const ShipperPanel = () => {
  const [activeView, setActiveView] = useState('assignments');
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Mock data for shipper assignments
  const assignments = [
    {
      id: 'SHIP001',
      from: 'Hà Nội',
      to: 'TP.HCM',
      status: 'assigned',
      priority: 'high',
      estimatedTime: '2 ngày',
      distance: '1,200 km',
      cargo: 'Điện tử',
      weight: '500 kg'
    },
    {
      id: 'SHIP002',
      from: 'Đà Nẵng',
      to: 'Cần Thơ',
      status: 'in_transit',
      priority: 'medium',
      estimatedTime: '1.5 ngày',
      distance: '800 km',
      cargo: 'Thực phẩm',
      weight: '300 kg'
    },
    {
      id: 'SHIP003',
      from: 'Hải Phòng',
      to: 'Nha Trang',
      status: 'completed',
      priority: 'low',
      estimatedTime: '1 ngày',
      distance: '600 km',
      cargo: 'Hàng hóa',
      weight: '200 kg'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return '#f39c12';
      case 'in_transit': return '#3498db';
      case 'completed': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned': return 'Đã giao';
      case 'in_transit': return 'Đang vận chuyển';
      case 'completed': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const handleAcceptAssignment = (assignmentId) => {
    alert(`Đã chấp nhận giao hàng ${assignmentId}`);
  };

  const handleUpdateStatus = (assignmentId, newStatus) => {
    alert(`Cập nhật trạng thái ${assignmentId} thành ${newStatus}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '28px' }}>
          🚚 Shipper Panel
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Quản lý các giao hàng được phân công và cập nhật trạng thái vận chuyển
        </p>
      </div>

      {/* View Toggle */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        borderBottom: '2px solid #ecf0f1',
        paddingBottom: '15px'
      }}>
        <button
          onClick={() => setActiveView('assignments')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: activeView === 'assignments' ? '#3498db' : '#ecf0f1',
            color: activeView === 'assignments' ? 'white' : '#2c3e50',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          📋 Giao hàng được phân công
        </button>
        <button
          onClick={() => setActiveView('history')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: activeView === 'history' ? '#3498db' : '#ecf0f1',
            color: activeView === 'history' ? 'white' : '#2c3e50',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          📊 Lịch sử giao hàng
        </button>
      </div>

      {/* Assignments View */}
      {activeView === 'assignments' && (
        <div>
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
          }}>
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e1e8ed',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    margin: 0, 
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    #{assignment.id}
                  </h3>
                  <span style={{
                    backgroundColor: getStatusColor(assignment.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getStatusText(assignment.status)}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#7f8c8d', marginRight: '8px' }}>📍</span>
                    <span style={{ fontWeight: '500' }}>{assignment.from}</span>
                    <span style={{ margin: '0 10px', color: '#bdc3c7' }}>→</span>
                    <span style={{ fontWeight: '500' }}>{assignment.to}</span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#7f8c8d', marginRight: '8px' }}>📦</span>
                    <span>{assignment.cargo} ({assignment.weight})</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#7f8c8d', marginRight: '8px' }}>⏱️</span>
                    <span>{assignment.estimatedTime}</span>
                    <span style={{ margin: '0 10px', color: '#bdc3c7' }}>•</span>
                    <span>{assignment.distance}</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#7f8c8d', marginRight: '8px' }}>⚡</span>
                    <span style={{
                      color: getPriorityColor(assignment.priority),
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      Ưu tiên {assignment.priority}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '10px',
                  marginTop: '15px'
                }}>
                  {assignment.status === 'assigned' && (
                    <button
                      onClick={() => handleAcceptAssignment(assignment.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
                    >
                      ✅ Chấp nhận
                    </button>
                  )}
                  
                  {assignment.status === 'in_transit' && (
                    <button
                      onClick={() => handleUpdateStatus(assignment.id, 'completed')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                      🏁 Hoàn thành
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedShipment(assignment)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#f39c12',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e22'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
                  >
                    👁️ Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History View */}
      {activeView === 'history' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
            📊 Lịch sử giao hàng
          </h3>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📈</div>
            <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
              Dữ liệu lịch sử giao hàng sẽ được hiển thị ở đây
            </p>
          </div>
        </div>
      )}

      {/* Shipment Detail Modal */}
      {selectedShipment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#2c3e50', margin: 0 }}>
                Chi tiết giao hàng #{selectedShipment.id}
              </h3>
              <button
                onClick={() => setSelectedShipment(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#7f8c8d'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#2c3e50' }}>Tuyến đường:</strong>
                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                  {selectedShipment.from} → {selectedShipment.to}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#2c3e50' }}>Hàng hóa:</strong>
                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                  {selectedShipment.cargo} ({selectedShipment.weight})
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#2c3e50' }}>Thời gian ước tính:</strong>
                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                  {selectedShipment.estimatedTime}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#2c3e50' }}>Khoảng cách:</strong>
                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                  {selectedShipment.distance}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#2c3e50' }}>Trạng thái:</strong>
                <p style={{ margin: '5px 0' }}>
                  <span style={{
                    backgroundColor: getStatusColor(selectedShipment.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getStatusText(selectedShipment.status)}
                  </span>
                </p>
              </div>

              <div>
                <strong style={{ color: '#2c3e50' }}>Mức độ ưu tiên:</strong>
                <p style={{ margin: '5px 0' }}>
                  <span style={{
                    color: getPriorityColor(selectedShipment.priority),
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {selectedShipment.priority}
                  </span>
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setSelectedShipment(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipperPanel;
