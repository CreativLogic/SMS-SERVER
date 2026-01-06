# SMS-SERVER

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**DIY SMS Gateway for HighLevel using Android Device**

A cost-effective, self-hosted SMS gateway that bridges HighLevel CRM with your own Android device, eliminating expensive third-party SMS services.

---

## 🚀 What This Does

This project allows you to:
- ✅ Send and receive SMS through HighLevel using your own phone number
- ✅ Bypass expensive SMS gateway fees (save $25-95/month)
- ✅ Use your personal number for warm, authentic outreach
- ✅ Maintain full control over your messaging infrastructure
- ✅ Deploy in under 30 minutes with zero coding experience required

**Perfect for:** Agencies, solo entrepreneurs, and businesses looking to cut costs while maintaining professional SMS communication.

---

## 💰 Cost Comparison

| Service | Monthly Cost | Your DIY Solution |
|---------|--------------|-------------------|
| myCRMSIM | $29-99/mo | **$0-5/mo** |
| Third-party Gateways | $50-150/mo | **$0-5/mo** |
| **Total Savings** | | **$300-1,800/year** |

---

## 📋 Prerequisites

Before you start, make sure you have:

### Required
- [ ] Android device (any model, can be an old phone)
- [ ] Active SIM card with SMS capability
- [ ] HighLevel account
- [ ] GitHub account (free)
- [ ] Railway account (free tier available)

### Recommended
- [ ] WiFi connection for Android device
- [ ] Power cable to keep device plugged in 24/7
- [ ] Basic understanding of copying/pasting

---

## 🏗️ System Architecture

```
HighLevel CRM
     ↓
     ↓ (Webhook: SMS send request)
     ↓
Your Backend Server (Railway)
     ↓
     ↓ (Forward to Android)
     ↓
Android SMS Gateway App
     ↓
     ↓ (Send via SIM)
     ↓
Recipient's Phone

(Inbound replies flow back up the same path)
```

---

## 🛠️ Quick Start Guide

### Step 1: Set Up Android Device (15 minutes)

1. **Install Android SMS Gateway App**
   - Download from: [Android SMS Gateway](https://github.com/android-sms-gateway/android-sms-gateway/releases)
   - Or use: [Textbee](https://textbee.dev) (easier for beginners)

2. **Configure the App**
   - Open the app and grant SMS permissions
   - Create an API key (save this securely)
   - Note your gateway URL
   - Keep the app running in background

3. **Keep Device Online**
   - Connect to WiFi
   - Keep plugged into power
   - Disable battery optimization for the gateway app

### Step 2: Deploy Backend to Railway (10 minutes)

1. **Fork or Clone This Repo**
   ```bash
   git clone https://github.com/CreativLogic/SMS-SERVER.git
   ```

2. **Sign Up for Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign in with GitHub

3. **Deploy**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository
   - Railway will auto-detect Node.js and deploy

4. **Add Environment Variables**
   In Railway project settings, add:
   ```
   GHL_ACCESS_TOKEN=your_highlevel_api_token
   GHL_PROVIDER_ID=your_provider_id
   YOUR_PHONE_NUMBER=+1234567890
   ANDROID_GATEWAY_URL=http://your-android-ip:8080
   ANDROID_API_KEY=your_android_api_key
   ```

5. **Get Your Railway URL**
   - Railway will provide a public URL like: `https://sms-server-production.up.railway.app`
   - Save this URL

### Step 3: Register HighLevel Custom Provider (20 minutes)

1. **Go to HighLevel Developer Portal**
   - Visit: [https://marketplace.gohighlevel.com/](https://marketplace.gohighlevel.com/)
   - Click "Create App" → "Private App"

2. **Configure App Settings**
   - App Name: "My SMS Gateway"
   - Add required scopes:
     - `conversations/message.write`
     - `conversations/message.readonly`
     - `conversations.write`
     - `conversations.readonly`
     - `contacts.readonly`

3. **Add Conversation Provider**
   - Type: SMS
   - Name: "My Phone Number Gateway"
   - Delivery URL: `https://your-railway-url.railway.app/ghl-webhook`
   - Save and note your Provider ID

4. **Install to Your HighLevel Account**
   - Generate OAuth URL from marketplace
   - Click to install
   - Authorize the app

5. **Switch SMS Provider in HighLevel**
   - Go to: Settings → Phone Numbers → Additional Settings
   - Change Provider to: "My Phone Number Gateway"
   - Save changes

### Step 4: Test Everything (5 minutes)

1. **Send Test SMS from HighLevel**
   - Open any contact
   - Send a test message
   - Check if it arrives on recipient's phone

2. **Test Inbound Reply**
   - Have recipient reply to your message
   - Check if reply appears in HighLevel conversation

3. **Check Logs**
   - Railway: View deployment logs
   - Android: Check gateway app logs
   - HighLevel: Check conversation history

✅ **Success!** You're now sending SMS through your own device!

---

## 📁 Project Structure

```
SMS-SERVER/
├── index.js          # Main server file (Express API)
├── package.json      # Node.js dependencies
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

---

## 🔧 Configuration

### Environment Variables

All configuration is done through environment variables:

| Variable | Description | Example |
|----------|-------------|----------|
| `PORT` | Server port (auto-set by Railway) | `3000` |
| `GHL_ACCESS_TOKEN` | HighLevel API token | `eyJhbGc...` |
| `GHL_PROVIDER_ID` | Your custom provider ID | `abc123...` |
| `YOUR_PHONE_NUMBER` | Your SMS number (E.164 format) | `+12125551234` |
| `ANDROID_GATEWAY_URL` | Android gateway API endpoint | `http://192.168.1.100:8080` |
| `ANDROID_API_KEY` | Android app API key | `sk_live_...` |

### Getting These Values

**GHL_ACCESS_TOKEN:**
- HighLevel → Settings → Developer → API Key

**GHL_PROVIDER_ID:**
- Created when you register your conversation provider in marketplace

**ANDROID_GATEWAY_URL:**
- Shown in Android SMS Gateway app settings
- If using Textbee: their dashboard provides this

**ANDROID_API_KEY:**
- Generated in Android SMS Gateway app
- Keep this secret!

---

## 🐛 Troubleshooting

### Issue: Messages not sending

**Check:**
- [ ] Railway server is running (check deployment logs)
- [ ] Android device is online and app is running
- [ ] Environment variables are correctly set
- [ ] HighLevel webhook URL is correct

**Solution:**
```bash
# Check Railway logs
railway logs

# Test your server endpoint
curl https://your-railway-url.railway.app/
```

### Issue: Inbound messages not appearing in HighLevel

**Check:**
- [ ] GHL_ACCESS_TOKEN is valid
- [ ] GHL_PROVIDER_ID matches your provider
- [ ] Android app has webhook configured correctly

**Solution:**
- Check Railway logs for errors when inbound message arrives
- Verify Android gateway is posting to `/inbound-sms` endpoint

### Issue: Android app keeps stopping

**Check:**
- [ ] Battery optimization disabled for the app
- [ ] App has SMS permissions granted
- [ ] Device is connected to power

**Solution:**
- Settings → Apps → [Gateway App] → Battery → Unrestricted
- Add app to "Protected apps" or "Auto-start" list

---

## 🔐 Security Best Practices

1. **Never commit secrets to Git**
   - Use environment variables only
   - `.env` file is in `.gitignore`

2. **Keep Android device secure**
   - Set up screen lock
   - Don't install unknown apps
   - Update Android OS regularly

3. **Rotate API keys periodically**
   - Change ANDROID_API_KEY every 90 days
   - Update in Railway when you do

4. **Monitor for unusual activity**
   - Check Railway logs weekly
   - Watch for failed authentication attempts

---

## 📊 Maintenance

### Daily
- ✅ Verify Android device is online
- ✅ Check that gateway app is running

### Weekly
- ✅ Review Railway logs for errors
- ✅ Test sending/receiving SMS

### Monthly
- ✅ Update dependencies: `npm update`
- ✅ Check Railway billing (should be $0-5)
- ✅ Restart Android device

---

## 🚀 Advanced Features

### Add Multiple Devices

Scale to handle higher volume:
1. Set up additional Android devices
2. Load balance between them
3. Route by area code or contact priority

### Add Delivery Reports

Track message delivery:
```javascript
// Add to index.js
app.post('/delivery-status', async (req, res) => {
  // Handle delivery webhooks from Android
});
```

### Add MMS Support

Send images and media:
- Android SMS Gateway supports MMS
- Extend index.js to handle media URLs

---

## 📞 Support

**Having issues?**

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review Railway deployment logs
3. Test each component individually
4. Open an issue on GitHub with:
   - Error messages
   - Steps to reproduce
   - Environment (Android version, Railway region, etc.)

---

## 📝 License

MIT License - feel free to modify and use for your projects.

---

## 🙏 Credits

Built with:
- [Express.js](https://expressjs.com/) - Backend framework
- [Axios](https://axios-http.com/) - HTTP client
- [Android SMS Gateway](https://github.com/android-sms-gateway/android-sms-gateway) - Device bridge
- [Railway](https://railway.app) - Hosting platform

---

## 🎯 Next Steps

Once you have this running:

1. **Scale your outreach** - Use HighLevel workflows with confidence
2. **Add more numbers** - Deploy multiple devices for different campaigns
3. **White-label & resell** - Package this for your agency clients
4. **Contribute** - Submit PRs to improve this project

---

**Made with ❤️ by CreativLogic**

*Save money. Own your infrastructure. Scale your business.*

---

## 🛒 Complete Shopping List & Costs

### Required Items

| Item | Cost | Where to Get | Notes |
|------|------|--------------|-------|
| **Android Device** | $0-50 | Use old phone or buy used | Any Android 5.0+ works |
| **SIM Card with SMS Plan** | $10-25/mo | Your carrier | Must support SMS |
| **Railway Hosting** | $0-5/mo | railway.app | Free tier includes 500 hours |
| **HighLevel Account** | $97-297/mo | gohighlevel.com | You likely have this |
| **USB Power Cable** | $5-10 | Amazon/local store | Keep device charged |
| **WiFi Connection** | $0 | Your existing internet | Device needs to stay online |

### Optional Items

| Item | Cost | Purpose |
|------|------|----------|
| **Phone Stand** | $10-15 | Keep device upright and visible |
| **Power Strip** | $15-20 | Organize cables |
| **Second Android Device** | $30-50 | Backup/redundancy |
| **Dedicated SIM Plan** | $15-30/mo | Separate from personal number |

### Total Setup Cost

**Minimum to get started:** $10-35  
**Monthly recurring:** $10-30 (mostly your SIM plan)

**Compare to:**
- myCRMSIM: $29-99/mo
- Twilio A2P 10DLC: $50-150/mo + fees
- Other SMS gateways: $50-200/mo

**Your savings:** $240-2,000+ per year

---

## ⚠️ Important: Responsible Use Policy

### ✅ This System Is Designed For:

**Professional Marketers & Agencies:**
- 1-on-1 customer conversations
- Warm follow-ups with existing leads
- Appointment reminders and confirmations
- Client support and relationship building
- Personalized outreach (under 100 messages/day per number)
- Transactional notifications

**Real-World Use Cases:**
- Real estate agents following up with prospects
- Agency owners nurturing client relationships
- Sales teams doing manual prospecting
- Service businesses sending appointment reminders
- Coaches scheduling sessions with clients

### ❌ This System Is NOT For:

**Prohibited Activities:**
- ❌ Mass SMS blasts to purchased lists
- ❌ Unsolicited marketing to cold contacts
- ❌ Spamming or harassment
- ❌ Automated bulk campaigns (1000+ msgs/day)
- ❌ Violating TCPA compliance rules
- ❌ Sending to people who didn't opt-in
- ❌ Illegal or unethical communications

### 📜 Legal & Compliance Notice

**TCPA Compliance:**  
You are responsible for complying with the Telephone Consumer Protection Act (TCPA) and all applicable regulations:

1. **Obtain Consent:** Only message contacts who explicitly opted in
2. **Honor Opt-Outs:** Immediately stop messaging anyone who asks to unsubscribe
3. **Identify Yourself:** Always include your business name and purpose
4. **Keep Records:** Maintain proof of consent for all contacts
5. **Respect Time Zones:** Don't message outside 8am-9pm recipient's local time

**Carrier Guidelines:**  
Mobile carriers monitor for spam. Violating their policies can result in:
- Your number being blocked
- SIM card suspension
- Account termination

**Volume Guidelines:**  
For personal/small business use, keep daily volume under:
- 100 messages per day per number (safe zone)
- 200 messages per day (yellow zone - monitor closely)
- 300+ messages per day (red zone - high risk of flagging)

If you need higher volume, register for proper A2P 10DLC through Twilio/LeadConnector.

### 🎯 How to Use This System Responsibly

**Best Practices:**

1. **Quality Over Quantity**
   - Focus on meaningful conversations
   - Personalize each message
   - Build relationships, not just blast lists

2. **Maintain Opt-In Records**
   - Document where you got each contact's number
   - Store consent timestamp and method
   - Use HighLevel's custom fields to track this

3. **Monitor Delivery & Responses**
   - Watch for high bounce rates (indicates bad list)
   - Track opt-out requests immediately
   - Pause campaigns if you see spam complaints

4. **Use for Warm Outreach**
   - Follow up after someone fills out a form
   - Message existing customers
   - Respond to inbound inquiries
   - Send appointment reminders

5. **Respect Your Recipients**
   - Don't message late at night
   - Honor opt-out requests instantly
   - Keep messages relevant and valuable
   - Don't be pushy or aggressive

**Remember:** This system gives you power. Use it ethically. Build trust, not spam folders.

---

## 🚨 Disclaimer

This project is provided for educational and legitimate business use only. The creators and contributors are not responsible for:

- Misuse of this software for spam or illegal activities
- Violations of TCPA or other telecommunications regulations
- Carrier or account suspensions due to improper use
- Any damages or legal issues arising from your use of this system

By using this software, you agree to:
- Comply with all applicable laws and regulations
- Use the system only for legitimate, consensual communications
- Take full responsibility for your messaging practices
- Obtain proper consent before contacting anyone

**Use wisely. Be ethical. Respect people's inboxes.**

