import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, ShieldCheck, TrendingUp, ArrowRight, Search } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-gray-100">
      {/* Navigation */}
      <nav className="border-b border-[#1e2329] bg-[#0f1116] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#161a1e] p-2 rounded-lg">
              <Truck className="w-6 h-6 text-[#f3ba2f]" />
            </div>
            <span className="text-xl font-bold text-[#f3ba2f]">LogiChain</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Đăng nhập
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#161a1e] rounded-full text-sm text-gray-400 mb-6">
            <ShieldCheck className="w-4 h-4 text-[#f3ba2f]" />
            <span>Blockchain-powered • Real-time tracking</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Minh bạch vận tải
            <br />
            <span className="text-[#f3ba2f]">Theo dõi tức thời</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Quản lý chuỗi cung ứng đầu-cuối với blockchain: định tuyến tối ưu, theo dõi lô hàng, chứng từ và bàn giao an toàn.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="flex items-center gap-3 bg-[#0f1116] border border-[#1e2329] rounded-xl p-3 focus-within:border-[#f3ba2f] transition-all">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm lô hàng, container, vận đơn..."
                className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') navigate('/login');
                }}
              />
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all"
              >
                Tra cứu
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-[#f3ba2f]" />
                <span className="text-3xl font-bold">12k+</span>
              </div>
              <p className="text-gray-400 text-sm">Shipments theo dõi</p>
            </div>
            <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#f3ba2f]" />
                <span className="text-3xl font-bold">99.9%</span>
              </div>
              <p className="text-gray-400 text-sm">Uptime tracking</p>
            </div>
            <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-[#f3ba2f]" />
                <span className="text-3xl font-bold">4.8★</span>
              </div>
              <p className="text-gray-400 text-sm">Đánh giá đối tác</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 border border-[#667eea]/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Bắt đầu ngay hôm nay</h2>
          <p className="text-gray-400 mb-6">Đăng nhập để quản lý và theo dõi shipments của bạn</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Đăng nhập để bắt đầu
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
