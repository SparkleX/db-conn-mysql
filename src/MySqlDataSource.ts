import { Connection, DataSource } from "db-conn";
import { Pool, createPool } from 'mysql2/promise.js';
import { MySqlConnection } from "./MySqlConnection.js";
import { MySqlDataSourceConfig } from "./MySqlDataSourceConfig.js";

export class MySqlDataSource implements DataSource {
    pool: Pool;
    public constructor(config: MySqlDataSourceConfig) {
        this.pool = createPool(config);
    }
    public async getConnection(): Promise<Connection> {
        const oTemp = await this.pool.getConnection();
        const conn = new MySqlConnection(oTemp, this.pool);
        return conn;
    }
    public async close(): Promise<void> {
        await this.pool.end();
    }
}