// SMS Gateway Server for HighLevel Integration
// This server acts as a bridge between HighLevel and your Android device

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_PROVIDER_ID = process.env.GHL_PROVIDER_ID;
const YOUR_PHONE_NUMBER = process.env.YOUR_PHONE_NUMBER;
const ANDROID_GATEWAY_URL = process.env.ANDROID_GATEWAY_URL;
const ANDROID_API_KEY = process.env.ANDROID_API_KEY;

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    service: 'SMS Gateway Server',
    timestamp: new Date().toISOString()
  });
});

// Endpoint 1: Receive SMS send requests from HighLevel
app.post('/ghl-webhook', async (req, res) => {
  console.log('Received SMS request from HighLevel:', req.body);
  
  const { contactId, locationId, messageId, type, phone, message } = req.body;
  
  // Validate required fields
  if (!phone || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: phone or message' 
    });
  }

  try {
    // Forward to Android SMS Gateway
    const response = await axios.post(
      `${ANDROID_GATEWAY_URL}/api/send`,
      {
        to: phone,
        message: message,
        messageId: messageId || Date.now().toString(),
        conversationId: contactId
      },
      {
        headers: { 
          'Authorization': `Bearer ${ANDROID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('SMS sent via Android gateway:', response.data);
    
    res.json({ 
      success: true, 
      id: messageId,
      status: 'sent'
    });
    
  } catch (err) {
    console.error('Failed to send SMS:', err.message);
    
    res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.response?.data || 'Android gateway error'
    });
  }
});

// Endpoint 2: Receive inbound SMS from Android device
app.post('/inbound-sms', async (req, res) => {
  console.log('Received inbound SMS from Android:', req.body);
  
  const { from, message, messageId, timestamp } = req.body;
  
  // Validate required fields
  if (!from || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: from or message' 
    });
  }

  try {
    // Post to HighLevel
    const response = await axios.post(
      'https://services.leadconnectorhq.com/conversations/add-inbound-message',
      {
        conversationProviderId: GHL_PROVIDER_ID,
        type: 'SMS',
        from: from,
        to: YOUR_PHONE_NUMBER,
        message: message,
        messageId: messageId || Date.now().toString(),
        timestamp: timestamp || new Date().toISOString()
      },
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('Inbound SMS posted to HighLevel:', response.data);
    
    res.json({ 
      success: true,
      messageId: messageId
    });
    
  } catch (err) {
    console.error('Failed to post inbound SMS to HighLevel:', err.message);
    
    res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.response?.data || 'HighLevel API error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SMS Gateway Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- GHL_ACCESS_TOKEN:', GHL_ACCESS_TOKEN ? '✓ Set' : '✗ Missing');
  console.log('- GHL_PROVIDER_ID:', GHL_PROVIDER_ID ? '✓ Set' : '✗ Missing');
  console.log('- YOUR_PHONE_NUMBER:', YOUR_PHONE_NUMBER ? '✓ Set' : '✗ Missing');
  console.log('- ANDROID_GATEWAY_URL:', ANDROID_GATEWAY_URL ? '✓ Set' : '✗ Missing');
  console.log('- ANDROID_API_KEY:', ANDROID_API_KEY ? '✓ Set' : '✗ Missing');
});
