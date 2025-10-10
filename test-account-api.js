// Test Account API với email
const API_BASE_URL = 'http://localhost:5000/api/accounts';

async function testCreateAccount() {
  try {
    console.log('🧪 Testing Account API with email...\n');
    
    // Test data
    const testAccount = {
      address: '0x1234567890123456789012345678901234567890',
      name: 'Test User',
      email: 'test@example.com',
      role: 'Customer'
    };
    
    console.log('📝 Creating account:', testAccount);
    
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAccount)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Account created successfully!');
      console.log('📊 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Failed to create account');
      console.log('📊 Error:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testCheckByEmail() {
  try {
    console.log('\n🔍 Testing check account by email...\n');
    
    const email = 'test@example.com';
    console.log('📧 Checking email:', email);
    
    const response = await fetch(`${API_BASE_URL}/check-email/${email}`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Check successful!');
      console.log('📊 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Check failed');
      console.log('📊 Error:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testCreateAccount();
  await testCheckByEmail();
}

runTests();
