import React, { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useForm } from '../hooks/useForm';
import { accountAPI } from '../services/api';
import '../assets/styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const from = location.state?.from?.pathname || '/dashboard';
  const [isSignUp, setIsSignUp] = useState(false);

  // Validation rules - dynamic based on isSignUp
  const validationRules = useMemo(() => {
    const baseRules = {
      email: {
        required: true,
        requiredMessage: 'Vui lòng nhập email',
        email: true,
        emailMessage: 'Email không hợp lệ'
      },
      password: {
        required: true,
        requiredMessage: 'Vui lòng nhập mật khẩu',
        minLength: 6,
        minLengthMessage: 'Mật khẩu phải có ít nhất 6 ký tự'
      }
    };

    if (isSignUp) {
      return {
        ...baseRules,
        name: {
          required: true,
          requiredMessage: 'Vui lòng nhập họ và tên',
          minLength: 2,
          minLengthMessage: 'Họ và tên phải có ít nhất 2 ký tự'
        },
        address: {
          required: true,
          requiredMessage: 'Vui lòng nhập địa chỉ ví',
          pattern: /^0x[a-fA-F0-9]{40}$/,
          patternMessage: 'Địa chỉ ví không hợp lệ (phải có định dạng 0x... và 40 ký tự hex)'
        }
      };
    }

    return baseRules;
  }, [isSignUp]);

  const initialValues = useMemo(() => ({
    email: '',
    password: '',
    name: '',
    address: ''
  }), []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (values) => {
    try {
      if (isSignUp) {
        // Đăng ký tài khoản
        const result = await accountAPI.createAccount({
          address: values.address,
          name: values.name,
          email: values.email,
          password: values.password,
          role: 'Customer'
        });

        if (!result.data.ok) {
          throw new Error(result.data.message || 'Đăng ký thất bại');
        }

        toast.success('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        setIsSignUp(false);
        return true; // Signal to reset form
      } else {
        // Đăng nhập
        const result = await accountAPI.login({
          email: values.email,
          password: values.password
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
        
        toast.success(`Chào mừng trở lại, ${userData.name || userData.email}!`);
        
        // Navigate to appropriate dashboard
        const redirectPath = userData.role === 'Owner' ? '/owner' : '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      const errorMessage = err.message || (isSignUp ? 'Đăng ký thất bại. Vui lòng thử lại.' : 'Đăng nhập thất bại. Vui lòng thử lại.');
      toast.error(errorMessage);
      throw err; // Re-throw to prevent form reset on error
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(initialValues, validationRules, onSubmit);

  // Reset form when switching between login/signup
  useEffect(() => {
    reset();
  }, [isSignUp, reset]);

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
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập email của bạn"
              className={touched.email && errors.email ? 'error' : ''}
            />
            {touched.email && errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập mật khẩu"
              className={touched.password && errors.password ? 'error' : ''}
            />
            {touched.password && errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập họ và tên của bạn"
                  className={touched.name && errors.name ? 'error' : ''}
                />
                {touched.name && errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ ví Ethereum</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0x..."
                  className={touched.address && errors.address ? 'error' : ''}
                />
                <small style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  Địa chỉ ví Ethereum của bạn (bắt đầu bằng 0x và 40 ký tự hex)
                </small>
                {touched.address && errors.address && (
                  <span className="error-text">{errors.address}</span>
                )}
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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

export default memo(Login);
