import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <span className="logo-icon">🚛</span>
            <h1>Logistics Blockchain</h1>
          </div>
          <p className="hero-subtitle">
            Hệ thống quản lý logistics được xây dựng trên công nghệ blockchain
          </p>
          <p className="hero-description"> 
            Theo dõi, quản lý và tối ưu hóa chuỗi cung ứng với tính minh bạch và bảo mật cao
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🔗</span>
              <span>Blockchain Technology</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Real-time Tracking</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Secure & Transparent</span>
            </div>
          </div>
          <button className="login-btn" onClick={() => navigate('/login')}>
            Đăng nhập để bắt đầu
          </button>
        </div>
        <div className="hero-image">
          <div className="blockchain-visual">
            <div className="block">Block 1</div>
            <div className="chain">→</div>
            <div className="block">Block 2</div>
            <div className="chain">→</div>
            <div className="block">Block 3</div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Tính năng chính</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Quản lý Shipment</h3>
            <p>Tạo và theo dõi các lô hàng với thông tin chi tiết</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Theo dõi vị trí</h3>
            <p>Giám sát vị trí thời gian thực của hàng hóa</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Báo cáo & Phân tích</h3>
            <p>Dashboard chi tiết với các báo cáo thống kê</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Quản lý người dùng</h3>
            <p>Hệ thống phân quyền linh hoạt cho các vai trò khác nhau</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Sẵn sàng bắt đầu?</h2>
        <p>Đăng nhập ngay để trải nghiệm hệ thống logistics blockchain</p>
        <button className="cta-btn" onClick={() => navigate('/login')}>
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};

export default HomePage;
