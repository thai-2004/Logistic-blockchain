import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { accountAPI } from '../services/api';
import '../assets/styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Đăng ký tài khoản
        if (!formData.email || !formData.password || !formData.name || !formData.address) {
          setError('Vui lòng nhập đầy đủ thông tin');
          return;
        }

        // Validate address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(formData.address)) {
          setError('Địa chỉ ví không hợp lệ (phải có định dạng 0x...)');
          return;
        }

        // Gửi API request để tạo tài khoản
        const result = await accountAPI.createAccount({
          address: formData.address,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'Customer'
        });

        if (!result.data.ok) {
          throw new Error(result.data.message || 'Đăng ký thất bại');
        }

        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setIsSignUp(false);
        setFormData({ email: '', password: '', name: '', address: '' });
      } else {
        // Đăng nhập
        if (!formData.email || !formData.password) {
          setError('Vui lòng nhập đầy đủ thông tin');
          return;
        }

        // Đăng nhập với email và password
        const result = await accountAPI.login({
          email: formData.email,
          password: formData.password
        });

        if (!result.data.success) {
          throw new Error(result.data.error || 'Đăng nhập thất bại');
        }

        // Đăng nhập thành công
        const userData = {
          email: result.data.account.email,
          role: result.data.account.role,
          name: result.data.account.name,
          address: result.data.account.address
        };
        
        // Extract token from response if available
        const token = result.data.token || result.data.accessToken || null;
        login(userData, token);
        
        // Navigate to appropriate dashboard
        const redirectPath = userData.role === 'Owner' ? '/owner' : '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } catch {
      setError(isSignUp ? 'Đăng ký thất bại. Vui lòng thử lại.' : 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🚛</span>
            <h1>Logistics Blockchain</h1>
          </div>
          <p className="login-subtitle">
            {isSignUp ? 'Tạo tài khoản mới' : 'Đăng nhập vào hệ thống'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ ví Ethereum</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  required
                />
                <small style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  Địa chỉ ví Ethereum của bạn (bắt đầu bằng 0x)
                </small>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {isSignUp ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...'}
              </>
            ) : (
              isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="auth-toggle">
            <p>
              {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData({ email: '', password: '', name: '', address: '' });
                  setError('');
                }}
              >
                {isSignUp ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
              </button>
            </p>
          </div>
          
          <button className="back-to-home-btn" onClick={() => navigate('/home')}>
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
