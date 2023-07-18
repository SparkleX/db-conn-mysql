import { Connection, Result } from "db-conn";
import * as mysql2 from 'mysql2/promise.js';

export class MySqlConnection implements Connection {
	private client: mysql2.Connection;
    private oPool: mysql2.Pool;
	public constructor(client: any, oPool?: mysql2.Pool) {
		this.client = client;
		this.oPool = oPool;
	}
	public async close(): Promise<void> {
		if (this.oPool) {
			this.oPool.releaseConnection(this.client as any);
			return;
		}
		await this.client.end();
		delete this.client;
	}
	public async execute(sql: string, params?: any): Promise<Result> {
		const [rows, fields] = await this.client.execute(sql, params);
		const rt: Result = {};
		rt.affectedRows = rows["affectedRows"];
		if( rt.affectedRows == undefined) {
			rt.data = rows as any;
		}
		return rt;
	}
	public async executeQuery(sql: string, params?: any): Promise<object[]> {
		const rt: Result = await this.execute(sql, params);
		if (rt.data === undefined) {
			throw new Error("No data returned");
		}
		return rt.data;
	}
	public async setAutoCommit(autoCommit: boolean): Promise<void> {
		if (autoCommit) {
			await this.execute("set autocommit = 1");
			return;
		}
		await this.execute("set autocommit = 0");
	}
	public async commit(): Promise<void> {
		const rt = await this.execute("commit");
	}
	public async rollback(): Promise<void> {
		const rt = await this.execute("rollback");
	}
}