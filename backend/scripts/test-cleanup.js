import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/shipments';

async function testCleanup() {
  try {
    console.log('🧪 Testing cleanup duplicates API...');
    
    const response = await fetch(`${API_BASE_URL}/cleanup-duplicates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Cleanup successful!');
      console.log('Results:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Cleanup failed!');
      console.log('Error:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing cleanup:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
  }
}

// Run the test
testCleanup();
