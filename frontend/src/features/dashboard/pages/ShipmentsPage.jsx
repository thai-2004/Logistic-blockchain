import React from 'react';
import PropTypes from 'prop-types';
import ShipmentList from '@components/ShipmentList';
import { Plus } from 'lucide-react';

const ShipmentsPage = ({ user, refreshKey, onCreate, onUpdateShipment }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Operations</p>
          <h1 className="text-xl font-bold text-slate-50">My Shipments</h1>
        </div>
        <button
          className="btn-primary"
          onClick={onCreate}
        >
          <Plus className="h-4 w-4" /> Create New Shipment
        </button>
      </div>
      <ShipmentList user={user} key={refreshKey} onUpdateShipment={onUpdateShipment} />
    </div>
  );
};

ShipmentsPage.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  refreshKey: PropTypes.number.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdateShipment: PropTypes.func,
};

export default ShipmentsPage;

