const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const jobRoutes = require('./routes/jobRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

const app = express();

// 🔌 Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
app.use('/api/blood-requests', bloodRequestRoutes);
const otpRoutes = require('./routes/otpRoutes');

app.use('/api/otp', otpRoutes);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Profile routes
const userProfileRoutes = require('./routes/UserProfileRoutes');
app.use('/api/profile', userProfileRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin', require('./routes/adminUserRoutes'));
// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
