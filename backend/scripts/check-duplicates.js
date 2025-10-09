import mongoose from 'mongoose';
import Shipment from '../models/shipmentModel.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/logistics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkDuplicates() {
  try {
    console.log('Checking for duplicate shipmentId records...');
    
    // Find all shipments
    const allShipments = await Shipment.find({});
    console.log(`Total shipments in database: ${allShipments.length}`);
    
    // Group by shipmentId to find duplicates
    const shipmentIdGroups = {};
    allShipments.forEach(shipment => {
      const id = shipment.shipmentId;
      if (!shipmentIdGroups[id]) {
        shipmentIdGroups[id] = [];
      }
      shipmentIdGroups[id].push(shipment);
    });
    
    // Find duplicates
    const duplicates = Object.keys(shipmentIdGroups).filter(id => shipmentIdGroups[id].length > 1);
    
    if (duplicates.length === 0) {
      console.log('No duplicate records found!');
      return;
    }
    
    console.log(`Found ${duplicates.length} duplicate shipmentId(s):`);
    
    duplicates.forEach(id => {
      const records = shipmentIdGroups[id];
      console.log(`\n📦 ShipmentId ${id} has ${records.length} records:`);
      records.forEach((record, index) => {
        console.log(`  ${index + 1}. ID: ${record._id}, Created: ${record.createdAt}, Status: ${record.status}`);
      });
    });
    
    return duplicates;
    
  } catch (error) {
    console.error('Error checking duplicates:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the check
checkDuplicates();
