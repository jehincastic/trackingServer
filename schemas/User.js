const { v4: uuid } = require('uuid');
const { ObjectId } = require('mongodb');

const Notifications = require('./Notifications');
const Connection = require('../Db');

class User extends Notifications {
  constructor(user, type = 'id') {
    if (type === 'register') {
      super('', type);
      const {
        firstName,
        lastName,
        email,
        password,
        getEmails,
      } = user;
      this.id = '';
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.getEmails = getEmails;
      this.password = password;
      this.isVerified = false;
      this.verificationCode = uuid();
    } else if (type === 'login') {
      const { email } = user;
      super(email, type);
      this.email = email;
    } else {
      const { id } = user;
      super(id, type);
      this.id = id;
    }
  }

  async getUserbyEmail() {
    const mongo = new Connection();
    try {
      if (this.email) {
        await mongo.createConnection();
        const { db } = mongo;
        const user = await db.collection('users').findOne({ email: this.email });
        if (!user) {
          return Promise.resolve(false);
        }
        // eslint-disable-next-line no-underscore-dangle
        this.id = user._id.toString();
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.getEmails = user.getEmails;
        this.password = user.password;
        this.isVerified = user.isVerified;
        this.verificationCode = user.verificationCode;
        await this.getAllNotifications(db);
        return Promise.resolve(true);
      }
      throw new Error('Access Denied Email Not Found');
    } catch (err) {
      return Promise.reject(err);
    } finally {
      mongo.closeConnection();
    }
  }

  async getUserbyId() {
    const mongo = new Connection();
    try {
      if (this.id) {
        await mongo.createConnection();
        const { db } = mongo;
        const userId = new ObjectId(this.id);
        const user = await db.collection('users').findOne({ _id: userId });
        if (!user) {
          return Promise.resolve(false);
        }
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.getEmails = user.getEmails;
        this.password = user.password;
        this.isVerified = user.isVerified;
        this.verificationCode = user.verificationCode;
        await this.getAllNotifications(db);
        return Promise.resolve(true);
      }
      throw new Error('Access Denied ID Not Found');
    } catch (err) {
      return Promise.reject(err);
    } finally {
      mongo.closeConnection();
    }
  }

  async createUser() {
    const mongo = new Connection();
    try {
      if (!this.id) {
        await mongo.createConnection();
        const { db } = mongo;
        const userJson = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          getEmails: this.getEmails,
          password: this.password,
          isVerified: false,
          verificationCode: this.verificationCode,
        };
        const data = await db.collection('users').insertOne(userJson);
        this.id = data.insertedId;
        const firstNotification = {
          title: 'Welcome to Price-Tracking',
          content: `Kindly verify your email address ${this.email}.`
          + 'We have sent an email with a confirmation link to your email address.'
          + 'In order to complete the sign-up process, please click the confirmation link.',
          date: Date.now(),
          action: '/verify',
          userId: new ObjectId(this.id),
          read: false,
        };
        await this.createNotification(firstNotification, db);
        return Promise.resolve(true);
      }
      throw new Error('Access Denied User Exists');
    } catch (err) {
      return Promise.reject(err);
    } finally {
      mongo.closeConnection();
    }
  }

  userJson() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      isVerified: this.isVerified,
      notifications: this.notifications,
    };
  }
}

module.exports = User;
