import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HomePage.css';

const lanes = [
  {
    name: 'Cold Chain Express',
    cargo: 'Dược phẩm • Thực phẩm tươi',
    rating: 4.8,
    time: 'ETA: 6h',
    img: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Port-to-Door',
    cargo: 'Container • Hàng xuất nhập khẩu',
    rating: 4.7,
    time: 'ETA: 18h',
    img: 'https://images.unsplash.com/photo-1504257365157-1496a50d48f2?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Air Freight Priority',
    cargo: 'Hàng giá trị cao • Nhanh',
    rating: 4.6,
    time: 'ETA: 4h',
    img: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Last Mile Fleet',
    cargo: 'Giao nhanh nội đô',
    rating: 4.5,
    time: 'ETA: 90 phút',
    img: 'https://images.unsplash.com/photo-1565498253126-48c1e1cfa838?auto=format&fit=crop&w=900&q=80'
  }
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <nav className="nav-bar">
        <div className="nav-logo">
          <span className="logo-icon-static">🚚</span>
          <span className="logo-text">ChainLogix</span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
          <div className="cart-icon">🛒</div>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Fresh • Fast • Delightful</p>
          <h1>Minh bạch vận tải. Theo dõi tức thời.</h1>
          <p className="hero-description">
            Quản lý chuỗi cung ứng đầu-cuối với blockchain: định tuyến tối ưu, theo dõi lô hàng, chứng từ và bàn giao an toàn.
          </p>
          <div className="search-bar">
            <input type="text" placeholder="Tìm lô hàng, container, vận đơn..." />
            <button onClick={() => navigate('/login')}>Tra cứu</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">12k+</span>
              <span className="stat-label">Shipments theo dõi</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime tracking</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.8★</span>
              <span className="stat-label">Đánh giá đối tác</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
              alt="Logistics hero"
            />
            <div className="hero-overlay">
              <div className="overlay-badge">📡 Real-time visibility</div>
              <div className="overlay-text">Theo dõi hành trình, checkpoint, và trạng thái giao nhận ngay trên dashboard.</div>
            </div>
          </div>
        </div>
      </header>

      <section className="restaurants">
        <div className="section-header">
          <div>
            <h2>Tuyến vận tải nổi bật</h2>
            <p>Lựa chọn tuyến, đội xe, và SLA giao nhận phù hợp nhu cầu.</p>
          </div>
          <button className="link-btn" onClick={() => navigate('/login')}>Xem tất cả →</button>
        </div>
        <div className="restaurant-grid">
          {lanes.map((r) => (
            <div className="restaurant-card" key={r.name}>
              <div className="card-image">
                <img src={r.img} alt={r.name} />
                <div className="time-badge">{r.time}</div>
              </div>
              <div className="card-body">
                <div className="card-title">
                  <span>{r.name}</span>
                  <span className="rating">★ {r.rating}</span>
                </div>
                <p className="cuisine">{r.cargo}</p>
                <button className="primary-btn" onClick={() => navigate('/login')}>
                  Theo dõi ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
