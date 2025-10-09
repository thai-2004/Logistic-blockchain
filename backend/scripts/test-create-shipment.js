import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/shipments';

async function testCreateShipment() {
  try {
    console.log('🧪 Testing create shipment API...');
    
    const shipmentData = {
      productName: 'Test Product',
      origin: 'Ho Chi Minh City',
      destination: 'Ha Noi'
    };
    
    console.log('📦 Creating shipment with data:', shipmentData);
    
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shipmentData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Shipment created successfully!');
      console.log('📊 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Shipment creation failed!');
      console.log('Error:', JSON.stringify(result, null, 2));
      
      // If it's a duplicate error, suggest cleanup
      if (result.error && result.error.includes('Duplicate')) {
        console.log('\n💡 Suggestion: Run cleanup duplicates API to fix this issue');
        console.log('   POST /api/shipments/cleanup-duplicates');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing create shipment:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
  }
}

// Run the test
testCreateShipment();
