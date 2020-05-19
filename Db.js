const { MongoClient } = require('mongodb');

const { mongoUri: url, mongoDbName: dbName } = require('./config');

class MongoConnection {
  constructor() {
    this.db = '';
    this.client = '';
    this.dbName = dbName;
    this.mongoCli = new MongoClient(url, { useUnifiedTopology: true });
  }

  async createConnection() {
    try {
      this.client = await this.mongoCli.connect();
      this.db = this.client.db(this.dbName);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async closeConnection() {
    try {
      if (this.db) {
        this.client.close();
      }
      return Promise.resolve(true);
    } catch (err) {
      return Promise.resolve(false);
    }
  }
}

module.exports = MongoConnection;
