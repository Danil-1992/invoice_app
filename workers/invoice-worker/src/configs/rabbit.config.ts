import amqp, { Channel, Connection } from 'amqplib';

class RabbitInit {
  static connections: Map<string, amqp.ChannelModel> = new Map(); // ← ChannelModel, не Connection
  static channels: Map<string, Channel> = new Map();

  static async initConnection(serviceName: string): Promise<amqp.ChannelModel | undefined> {
    if (this.connections.has(serviceName)) {
      return this.connections.get(serviceName);
    }

    const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
    const rabbitmqPort = process.env.RABBITMQ_PORT || 5672;
    const rabbitmqUrl = `amqp://${rabbitmqHost}:${rabbitmqPort}`;

    console.log(`🔄 Подключение к RabbitMQ: ${rabbitmqUrl}`);

    try {
      const connection = await amqp.connect(rabbitmqUrl, { heartbeat: 60 });

      connection.on('error', (err) => {
        console.error(`RabbitMQ error for ${serviceName}:`, err.message);
        this.connections.delete(serviceName);
        setTimeout(() => this.initConnection(serviceName), 5000);
      });

      connection.on('close', () => {
        console.log(`RabbitMQ closed for ${serviceName}`);
        this.connections.delete(serviceName);
        setTimeout(() => this.initConnection(serviceName), 5000);
      });

      this.connections.set(serviceName, connection);
      console.log(`✅ RabbitMQ подключен для сервиса: ${serviceName}`);
      return connection;
    } catch (err) {
      console.error(`❌ Ошибка подключения к RabbitMQ: ${(err as Error).message}`);
      setTimeout(() => this.initConnection(serviceName), 5000);
    }
  }

  static async initChannel(serviceName: string, channelName: string): Promise<Channel> {
    const key = `${serviceName}-${channelName}`;
    
    if (this.channels.has(key)) {
      return this.channels.get(key)!;
    }

    const connection = await this.initConnection(serviceName);
    
    if (!connection) {
      throw new Error(`Нет соединения для сервиса: ${serviceName}`);
    }

    try {
      const channel = await connection.createChannel(); // ✅ connection имеет createChannel

      channel.on('error', (err) => {
        console.error(`Channel error for ${key}:`, err.message);
        this.channels.delete(key);
      });

      channel.on('close', () => {
        console.log(`Channel closed for ${key}`);
        this.channels.delete(key);
      });

      this.channels.set(key, channel);
      console.log(`✅ Канал создан: ${key}`);
      return channel;
    } catch (err) {
      console.error(`❌ Ошибка создания канала ${key}:`, (err as Error).message);
      throw err;
    }
  }

  static async closeAll(): Promise<void> {
    console.log('🔄 Закрытие всех RabbitMQ соединений...');
    
    for (const [name, conn] of this.connections) {
      try {
        await conn.close();
        console.log(`✅ Закрыто соединение: ${name}`);
      } catch (err) {
        console.error(`❌ Ошибка при закрытии ${name}:`, (err as Error).message);
      }
    }
    
    this.connections.clear();
    this.channels.clear();
    console.log('✅ Все RabbitMQ соединения закрыты');
  }
}

export default RabbitInit;