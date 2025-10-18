const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const Stripe = require('stripe');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Initialize payment gateways
const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

const stripe = new Stripe(functions.config().stripe.secret_key);

// Razorpay payment creation
app.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Razorpay payment verification
app.post('/verify-razorpay-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', functions.config().razorpay.key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update order status
      await db.collection('orders').doc(orderId).update({
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stripe payment intent
app.post('/create-stripe-payment', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shiprocket integration
app.post('/create-shipment', async (req, res) => {
  try {
    const { orderId, orderData } = req.body;
    
    // Get Shiprocket token
    const authResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: functions.config().shiprocket.email,
      password: functions.config().shiprocket.password,
    });

    const token = authResponse.data.token;

    // Create shipment
    const shipmentData = {
      order_id: orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary",
      billing_customer_name: orderData.customerName,
      billing_last_name: "",
      billing_address: orderData.address,
      billing_city: orderData.city,
      billing_pincode: orderData.pincode,
      billing_state: orderData.state,
      billing_country: "India",
      billing_email: orderData.email,
      billing_phone: orderData.phone,
      shipping_is_billing: true,
      order_items: orderData.items,
      payment_method: "Prepaid",
      sub_total: orderData.amount,
      length: 10,
      breadth: 15,
      height: 20,
      weight: 2.5,
    };

    const shipmentResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      shipmentData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update order with tracking info
    await db.collection('orders').doc(orderId).update({
      shipmentId: shipmentResponse.data.shipment_id,
      trackingId: shipmentResponse.data.awb_code,
      shippingStatus: 'shipped',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, data: shipmentResponse.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shiprocket webhook for delivery updates
app.post('/shiprocket-webhook', async (req, res) => {
  try {
    const { awb, current_status, order_id } = req.body;

    await db.collection('orders').where('trackingId', '==', awb).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.update({
            shippingStatus: current_status.toLowerCase(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });
      });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User creation trigger
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  try {
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
});

// Order status update trigger
exports.onOrderUpdate = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Send notification if status changed
    if (newValue.status !== previousValue.status) {
      // Implement push notification logic here
      console.log(`Order ${context.params.orderId} status changed to ${newValue.status}`);
    }
  });

exports.api = functions.https.onRequest(app);