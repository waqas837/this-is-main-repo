// QueueService.js

const { createClient } = require('redis');
require('dotenv').config();

class QueueService {
  constructor() {
    this.clients = [];
    this.maxClients = 5;
    this.localQueue = [];
    this.isProcessingLocal = false;
    this.connectAll();
    setInterval(() => this.processLocalQueue(), 1000);
  }

  connectAll() {
    for (let i = 0; i < this.maxClients; i++) {
      const client = createClient({
        password: '9EkYFxRxG2sP9VfaPxpuKWrinfyuFt7Q',
        socket: {
            host: 'redis-13978.c289.us-west-1-2.ec2.redns.redis-cloud.com',
            port: 13978
        }
    });
      client.on('error', (err) => console.log('Redis Client Error', err));
      client.on('connect', () => console.log('Connected to Redis'));

      client.connect().catch(console.error);
      this.clients.push(client);
    }
  }

  getClient() {
    return this.clients[Math.floor(Math.random() * this.clients.length)];
  }

  async addToQueue(queueName, data, retries = 3) {
    return new Promise((resolve, reject) => {
      const attemptAdd = (attemptsLeft) => {
        this.localQueue.push({
          queueName,
          data,
          resolve,
          reject,
          attemptsLeft
        });
        if (!this.isProcessingLocal) {
          this.processLocalQueue();
        }
      };
      attemptAdd(retries);
    });
  }

  async processLocalQueue() {
    if (this.isProcessingLocal || this.localQueue.length === 0) return;
    this.isProcessingLocal = true;

    while (this.localQueue.length > 0) {
      const { queueName, data, resolve, reject, attemptsLeft } = this.localQueue.shift();
      const startTime = Date.now();
      try {
        const client = this.getClient();
        await Promise.race([
          client.lPush(queueName, JSON.stringify(data)),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Redis operation timed out')), 5000);
          })
        ]);
        const endTime = Date.now();
        console.log(`Added to queue ${queueName} in ${endTime - startTime}ms:`);
        resolve();
      } catch (error) {
        console.error(`Error adding to queue ${queueName}:`, error);
        if (attemptsLeft > 0) {
          this.localQueue.push({ queueName, data, resolve, reject, attemptsLeft: attemptsLeft - 1 });
        } else {
          reject(error);
        }
        break;
      }
    }

    this.isProcessingLocal = false;
  }

  async processQueue(queueName, processor) {
    const client = this.getClient();
    console.log(`Start processing queue: ${queueName}`);
    while (true) {
      try {
        const result = await client.brPop(queueName, 0);
        if (result) {
          const data = JSON.parse(result.element);
          console.log(`Processing item from ${queueName}:`);
          await processor(data);
        }
      } catch (error) {
        console.error(`Error processing queue ${queueName}:`, error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
      }
    }
  }

  startProcessing(queueName, processor) {
    this.processQueue(queueName, processor).catch(error => {
      console.error(`Error in queue processing for ${queueName}:`, error);
      setTimeout(() => this.startProcessing(queueName, processor), 5000);
    });
  }
}

module.exports = new QueueService();
