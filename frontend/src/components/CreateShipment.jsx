import React, { useMemo, memo } from 'react';
import { shipmentAPI } from '@services/api';
import { useForm } from '@hooks/useForm';
import { useToast } from '@contexts/ToastContext';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Truck, Package, MapPin, Loader2, RefreshCw, Plus } from 'lucide-react';

const CreateShipment = ({ user, onShipmentCreated }) => {
  const toast = useToast();
  const [feeInfo, setFeeInfo] = useState({ loading: true, feeEnabled: false, feeEth: null });

  // Validation rules
  const validationRules = useMemo(() => ({
    productName: {
      required: true,
      requiredMessage: 'Vui lòng nhập tên sản phẩm',
      minLength: 2,
      minLengthMessage: 'Tên sản phẩm phải có ít nhất 2 ký tự',
      maxLength: 100,
      maxLengthMessage: 'Tên sản phẩm không được vượt quá 100 ký tự'
    },
    origin: {
      required: true,
      requiredMessage: 'Vui lòng nhập điểm xuất phát',
      minLength: 2,
      minLengthMessage: 'Điểm xuất phát phải có ít nhất 2 ký tự',
      maxLength: 200,
      maxLengthMessage: 'Điểm xuất phát không được vượt quá 200 ký tự'
    },
    destination: {
      required: true,
      requiredMessage: 'Vui lòng nhập điểm đến',
      minLength: 2,
      minLengthMessage: 'Điểm đến phải có ít nhất 2 ký tự',
      maxLength: 200,
      maxLengthMessage: 'Điểm đến không được vượt quá 200 ký tự'
    }
  }), []);

  const initialValues = useMemo(() => ({
    productName: '',
    origin: '',
    destination: ''
  }), []);

  // Fetch fee info (with manual refresh support)
  useEffect(() => {
    refreshFee();
  }, []);

  const refreshFee = async () => {
    let active = true;
    setFeeInfo((prev) => ({ ...prev, loading: true }));
    try {
      const res = await shipmentAPI.getShipmentFee();
      if (!active) return;
      const feeEnabled = !!res.data.feeEnabled;
      const feeEth = typeof res.data.shipmentFeeEth === 'number'
        ? res.data.shipmentFeeEth
        : Number(res.data.shipmentFee) / 1e18;
      // format to 6 decimals for display
      const feeEthDisplay = feeEth != null ? Number(feeEth).toFixed(6) : null;
      setFeeInfo({ loading: false, feeEnabled, feeEth: feeEthDisplay });
    } catch (err) {
      if (!active) return;
      console.error('Fetch shipment fee error:', err);
      setFeeInfo({ loading: false, feeEnabled: false, feeEth: null });
    }
    return () => { active = false; };
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        customer: user?.address || undefined
      };
      const response = await shipmentAPI.createShipment(payload);
      
      // Handle success response (201)
      const shipment = response.data.shipment || response.data.existingShipment;
      
      if (response.status === 201 || response.data.success) {
        toast.success(`Shipment created successfully! ID: ${shipment?.shipmentId || 'N/A'}`);
        
        // Call callback if provided
        if (onShipmentCreated && shipment) {
          onShipmentCreated(shipment);
        }
      }
      
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      const rawMessage = data?.message || data?.error || err.message;

      // Handle 200 response (duplicate transaction but same shipment)
      if (status === 200 && data?.isDuplicate) {
        const shipment = data.shipment;
        toast.info(data.message || `Shipment already exists. ID: ${shipment?.shipmentId || 'N/A'}`);
        
        if (onShipmentCreated && shipment) {
          onShipmentCreated(shipment);
        }
        return;
      }

      // Gracefully handle duplicate shipment (409 Conflict)
      // This happens when shipment ID exists but with different transaction
      // Usually means blockchain was reset but database still has old data
      if (status === 409 && data) {
        // Try to get shipment from response (prefer shipment over existingShipment)
        const shipment = data.shipment || data.existingShipment;
        const shipmentId = shipment?.shipmentId;
        
        // Show detailed error message if conflict details are available
        let message = data.message || data.error || 'Shipment ID conflict';
        if (data.conflictDetails) {
          message = `Shipment ID ${shipmentId} đã tồn tại với sản phẩm khác. ` +
                   `Có thể blockchain đã được reset. ` +
                   `Sản phẩm hiện tại: "${data.conflictDetails.existingProductName}"`;
        } else if (shipmentId) {
          message = `Shipment ID ${shipmentId} đã tồn tại trong database`;
        }

        toast.warning(message);

        // Don't call callback for real conflicts - let user know there's an issue
        // User should check the existing shipment or contact admin
        return;
      } else {
        // For other errors, show detailed message
        let errorMessage = rawMessage || 'Failed to create shipment';

        // Fee-related hints for local deploy
        if (rawMessage?.toLowerCase().includes('insufficient funds')) {
          errorMessage = 'Ví backend không đủ ETH để trả phí shipment. Nạp thêm ETH cho PRIVATE_KEY trong .env.';
        } else if (rawMessage?.toLowerCase().includes('cannot fetch shipment fee settings')) {
          errorMessage = 'Không lấy được fee từ smart contract. Kiểm tra RPC/contract address.';
        }

        toast.error(errorMessage);
        console.error('Create shipment error:', err);
        throw err; // Re-throw to prevent form reset on error
      }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-3 rounded-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-100">Tạo Shipment Mới</h2>
        </div>
        <p className="text-gray-400 mb-4">Tạo lô hàng mới trên blockchain</p>
        
        {/* Fee Info */}
        <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-4 inline-flex items-center gap-3">
          {feeInfo.loading ? (
            <>
              <Loader2 className="w-4 h-4 text-[#f3ba2f] animate-spin" />
              <span className="text-sm text-gray-400">Đang tải phí tạo shipment...</span>
            </>
          ) : (
            <>
              <Package className="w-4 h-4 text-[#f3ba2f]" />
              <span className="text-sm text-gray-400">
                {feeInfo.feeEnabled
                  ? `Phí tạo shipment: ${feeInfo.feeEth ?? '?'} ETH`
                  : 'Hiện tại không thu phí tạo shipment'}
              </span>
              <button
                type="button"
                onClick={refreshFee}
                disabled={feeInfo.loading}
                className="ml-2 px-3 py-1 text-xs bg-[#0b0e11] border border-[#1e2329] rounded-lg text-gray-300 hover:text-[#f3ba2f] hover:border-[#f3ba2f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${feeInfo.loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
            </>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-[#0f1116] border border-[#1e2329] rounded-xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Package className="w-4 h-4" />
              Tên sản phẩm <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={values.productName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập tên sản phẩm"
              className={`w-full px-4 py-3 bg-[#0b0e11] border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                touched.productName && errors.productName
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-[#1e2329] focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50'
              }`}
            />
            {touched.productName && errors.productName && (
              <p className="mt-1 text-sm text-red-400">{errors.productName}</p>
            )}
          </div>

          {/* Origin */}
          <div>
            <label htmlFor="origin" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              Điểm xuất phát <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={values.origin}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập điểm xuất phát"
              className={`w-full px-4 py-3 bg-[#0b0e11] border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                touched.origin && errors.origin
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-[#1e2329] focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50'
              }`}
            />
            {touched.origin && errors.origin && (
              <p className="mt-1 text-sm text-red-400">{errors.origin}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              Điểm đến <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={values.destination}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập điểm đến"
              className={`w-full px-4 py-3 bg-[#0b0e11] border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                touched.destination && errors.destination
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-[#1e2329] focus:border-[#f3ba2f] focus:ring-[#f3ba2f]/50'
              }`}
            />
            {touched.destination && errors.destination && (
              <p className="mt-1 text-sm text-red-400">{errors.destination}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1e2329]">
            <button
              type="button"
              onClick={reset}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0b0e11] border border-[#1e2329] text-gray-300 rounded-lg font-medium hover:border-[#f3ba2f] hover:text-[#f3ba2f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5" />
                  Tạo Shipment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateShipment.propTypes = {
  user: PropTypes.shape({
    address: PropTypes.string,
  }),
  onShipmentCreated: PropTypes.func,
};

export default memo(CreateShipment);