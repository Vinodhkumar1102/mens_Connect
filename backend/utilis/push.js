// Push Notification Service (Local notifications for now)
const sendPushNotification = async (title, message, data = {}) => {
  try {
    console.log('🔔 PUSH NOTIFICATION TRIGGERED');
    console.log('Title:', title);
    console.log('Message:', message);
    console.log('Data:', data);
    
    // Log for debugging - in production this would integrate with FCM
    console.log('📱 For mobile users: This notification would be sent via Firebase Cloud Messaging');
    console.log('Notification object:', {
      title: title || 'New Alert',
      body: message || 'You have a new message',
      data: data,
    });
  } catch (error) {
    console.error('❌ Error in push notification:', error.message);
  }
};

// Alternative: Send to specific topic
const sendTopicNotification = async (topic, title, message, data = {}) => {
  try {
    console.log('🔔 TOPIC NOTIFICATION SENT:', topic);
    console.log('Title:', title);
    console.log('Message:', message);
  } catch (error) {
    console.error('❌ Error sending topic notification:', error.message);
  }
};

module.exports = sendPushNotification;
module.exports.sendTopicNotification = sendTopicNotification;
