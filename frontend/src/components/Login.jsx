import React, { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useToast } from '@contexts/ToastContext';
import { useForm } from '@hooks/useForm';
import { accountAPI } from '@services/api';
import { Truck, Mail, Lock, User, Wallet, ArrowLeft, Loader2 } from 'lucide-react';

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
        minLength: 8,
        minLengthMessage: 'Mật khẩu phải có ít nhất 8 ký tự'
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
      const status = err.response?.status;
      const data = err.response?.data;
      
      // Handle 409 Conflict (duplicate email/address) gracefully
      if (status === 409) {
        let errorMessage;
        if (isSignUp) {
          errorMessage = data?.message || data?.error || 'Email hoặc địa chỉ ví đã được sử dụng. Vui lòng thử lại với thông tin khác.';
        } else {
          errorMessage = data?.message || data?.error || 'Thông tin đăng nhập không chính xác.';
        }
        toast.error(errorMessage);
        // Return without throwing to prevent uncaught promise rejection
        // This is expected behavior for duplicate accounts
        return;
      }
      
      // Extract error message for other errors
      let errorMessage = data?.message || data?.error || err.message;
      if (!errorMessage) {
        errorMessage = isSignUp ? 'Đăng ký thất bại. Vui lòng thử lại.' : 'Đăng nhập thất bại. Vui lòng thử lại.';
      }
      
      toast.error(errorMessage);
      // Only throw non-409 errors to prevent form reset
      throw err;
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
    <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-[#161a1e] p-3 rounded-lg">
              <Truck className="w-6 h-6 text-[#f3ba2f]" />
            </div>
            <h1 className="text-2xl font-bold text-[#f3ba2f]">LogiChain</h1>
          </div>
          <p className="text-gray-400">
            {isSignUp ? 'Tạo tài khoản mới' : 'Đăng nhập vào hệ thống'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Nhập email của bạn"
                className={`w-full px-4 py-3 bg-[#0b0e11] border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  touched.email && errors.email
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-[#1e2329] focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50'
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4" />
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Nhập mật khẩu"
                className={`w-full px-4 py-3 bg-[#0b0e11] border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  touched.password && errors.password
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-[#1e2329] focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50'
                }`}
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập họ và tên của bạn"
                    className={`w-full px-4 py-3 bg-[#0b0e11] border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      touched.name && errors.name
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-[#1e2329] focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50'
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Wallet className="w-4 h-4" />
                    Địa chỉ ví Ethereum
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0x..."
                    className={`w-full px-4 py-3 bg-[#0b0e11] border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all font-mono text-sm ${
                      touched.address && errors.address
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-[#1e2329] focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50'
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Địa chỉ ví Ethereum của bạn (bắt đầu bằng 0x và 40 ký tự hex)
                  </p>
                  {touched.address && errors.address && (
                    <p className="mt-1 text-sm text-red-400">{errors.address}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSignUp ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...'}
                </>
              ) : (
                isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#f3ba2f] hover:underline font-medium"
                >
                  {isSignUp ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
                </button>
              </p>
            </div>

            <button
              onClick={() => navigate('/home')}
              className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
