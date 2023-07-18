import { Connection, DataSource } from "db-conn";
import { Pool, createPool } from 'mysql2/promise.js';
import { MySqlConnection } from "./MySqlConnection";
export class MySqlDataSource implements DataSource {
    pool: Pool;
    public constructor() {
        this.pool = createPool({
            host: 'localhost',
            user: 'root',
            database: 'test',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
    }
    public async getConnection(): Promise<Connection> {
        const oTemp = await this.pool.getConnection();
        const conn = new MySqlConnection(oTemp, this.pool);
        return conn;
    }
    public async close(): Promise<void> {
        return;
    }
}