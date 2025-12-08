import React, { useMemo, memo } from 'react';
import { shipmentAPI } from '../services/api';
import { useForm } from '../hooks/useForm';
import { useToast } from '../contexts/ToastContext';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

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
    <div className="create-shipment">
      <div className="form-header">
        <h2>🚛 Tạo Shipment Mới</h2>
        <p className="form-subtitle">Tạo lô hàng mới trên blockchain</p>
        <p className="form-subtitle" style={{ marginTop: '6px', fontSize: '13px' }}>
          {feeInfo.loading
            ? 'Đang tải phí tạo shipment...'
            : feeInfo.feeEnabled
              ? `Phí tạo shipment hiện tại: ${feeInfo.feeEth ?? '?'} ETH`
              : 'Hiện tại không thu phí tạo shipment'}
          <button
            type="button"
            onClick={refreshFee}
            disabled={feeInfo.loading}
            style={{ marginLeft: '8px', fontSize: '12px' }}
            className="btn btn-secondary"
          >
            Làm mới phí
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="productName">Tên sản phẩm *</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={values.productName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nhập tên sản phẩm"
            className={`form-input ${touched.productName && errors.productName ? 'error' : ''}`}
          />
          {touched.productName && errors.productName && (
            <span className="error-text">{errors.productName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="origin">Điểm xuất phát *</label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={values.origin}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nhập điểm xuất phát"
            className={`form-input ${touched.origin && errors.origin ? 'error' : ''}`}
          />
          {touched.origin && errors.origin && (
            <span className="error-text">{errors.origin}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="destination">Điểm đến *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={values.destination}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nhập điểm đến"
            className={`form-input ${touched.destination && errors.destination ? 'error' : ''}`}
          />
          {touched.destination && errors.destination && (
            <span className="error-text">{errors.destination}</span>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={reset}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner-small"></span>
                Đang tạo...
              </>
            ) : (
              <>
                🚛 Tạo Shipment
              </>
            )}
          </button>
        </div>
      </form>
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