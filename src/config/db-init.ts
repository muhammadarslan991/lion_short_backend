import { createConnection, Connection } from 'typeorm';
import * as entities from '../db/entity';

export const connectDatabase = async (): Promise<Connection> => {
  try {
    const entityClasses = Object.values(entities) as Function[];

    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgress',
      password: process.env.DB_PASSWORD || 'postgress',
      database: process.env.DB_NAME || 'lion_short',
      synchronize: true,
      logging: true,
      entities: entityClasses // Explicitly type entities as an array of classes
    });

    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};
