import { DataSource } from 'typeorm';
import dbConfig from './db.config';

export const AppDataSource = new DataSource(dbConfig());
