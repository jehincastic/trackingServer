const { ObjectId } = require('mongodb');

class Notifications {
  constructor(id, type) {
    if (type === 'register') {
      this.notificationsType = 'new';
      this.notifications = [];
    }
  }

  async getAllNotifications(db) {
    try {
      const userId = new ObjectId(this.id);
      this.notifications = await db.collection('notifications')
        .find({ userId })
        .project({ userId: 0 })
        .toArray();
      this.notificationsType = 'all';
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getUnreadNotifications(db) {
    try {
      const userId = new ObjectId(this.id);
      this.notifications = await db.collection('notifications')
        .find({ userId, read: false })
        .project({ userId: 0 })
        .toArray();
      this.notificationsType = 'unread';
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createNotification(newNotification, db) {
    const notification = { ...newNotification };
    await db.collection('notifications').insertOne(notification);
    delete notification.userId;
    this.notifications.push({
      ...notification,
    });
  }
}

module.exports = Notifications;
