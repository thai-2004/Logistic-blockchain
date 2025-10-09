import mongoose from 'mongoose';
import Shipment from '../models/shipmentModel.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/logistics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function cleanupDuplicates() {
  try {
    console.log('🧹 Starting duplicate cleanup...');
    
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
    
    console.log(`Found ${duplicates.length} duplicate shipmentId(s)`);
    
    let totalDeleted = 0;
    
    for (const duplicateId of duplicates) {
      const records = shipmentIdGroups[duplicateId];
      console.log(`\n📦 Processing ShipmentId ${duplicateId} (${records.length} records):`);
      
      // Sort by creation date (keep the oldest one)
      records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      const keepRecord = records[0]; // Keep the first (oldest) record
      const deleteRecords = records.slice(1); // Delete the rest
      
      console.log(`  eeping record: ${keepRecord._id} (created: ${keepRecord.createdAt})`);
      
      // Delete duplicate records
      for (const record of deleteRecords) {
        console.log(`  Deleting record: ${record._id} (created: ${record.createdAt})`);
        await Shipment.findByIdAndDelete(record._id);
        totalDeleted++;
      }
    }
    
    console.log(`\n Cleanup completed! Deleted ${totalDeleted} duplicate records.`);
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the cleanup
cleanupDuplicates();
