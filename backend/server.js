require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Models
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  subscribedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
});

const newsletterSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  imageUrl: String,
  important: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
  sentBy: String
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Routes - Subscribers
app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const subscriber = new Subscriber(req.body);
    await subscriber.save();
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/subscribers/:email', async (req, res) => {
  try {
    await Subscriber.findOneAndDelete({ email: req.params.email });
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export CSV
app.get('/api/subscribers/export', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    const csv = ['Email,Name,Subscribed Date\n', 
      subscribers.map(s => `${s.email},${s.name || ''},${s.subscribedAt}`).join('\n')].join('');
    res.header('Content-Type', 'text/csv');
    res.attachment('subscribers.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes - Newsletters
app.get('/api/newsletters', async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ sentAt: -1 });
    res.json(newsletters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/newsletters', async (req, res) => {
  try {
    const newsletter = new Newsletter(req.body);
    await newsletter.save();
    res.status(201).json(newsletter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/newsletters/:id', async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Newsletter deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

