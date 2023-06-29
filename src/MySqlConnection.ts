import { Connection, Result, ResultSetMetaData, ResultSetColumnMetadata, SqlType } from "db-conn";

export class MySqlConnection implements Connection {
	private client: any;
	public constructor(client: any) {
		this.client = client;

	}
	public async close(): Promise<void> {
		await this.client.end();
		delete this.client;
	}
	public async execute(sql: string, params?: any): Promise<Result> {
		const [rows, fields] = await this.client.execute(sql, params);
		const rt: Result = {};
		rt.data = rows;
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
		if (!autoCommit) {
			const rt = await this.execute("begin");
		}
	}
	public async commit(): Promise<void> {
		const rt = await this.execute("commit");
	}
	public async rollback(): Promise<void> {
		const rt = await this.execute("rollback");
	}
	private toAnsiTypeColumns(metadata: any) : ResultSetMetaData {
		const rt = [];
		for(let mField of metadata) {
			const field: ResultSetColumnMetadata = {};
			field.name = mField.name;
			field.type = this.toAnsiType(mField.dataTypeID);
			rt.push(field);
		}
		return rt;
	}
	private toAnsiType(dataTypeID: number) : SqlType {
		switch(dataTypeID) {
		case 23:
			return SqlType.integer;
		case 1043:
			return SqlType.varchar;
		case 1700:
			return SqlType.decimal;
		case 701:
			return SqlType.float;
		case 1114:
			return SqlType.timestamp;
		case 1082:
			return SqlType.date;
		case 1083:
			return SqlType.time;
		case 25:
			return SqlType.clob;
		case 17:
			return SqlType.blob;	
		}
		return "unknown" as SqlType;
	}
	private toAnsiValueRows(rows: [any], metadata: ResultSetMetaData) : {}[] {
		const rt = [];
		for(let row of rows) {
			const newRow = {} as any;
			for(let field of metadata) {
				const value = row[field.name];
				newRow[field.name] = this.toAnsiValue(value, field.type);
				
			}
			rt.push(newRow);
		}
		return rt;
	}

	private toAnsiValue(value: any, type: SqlType) : number|string {
		if (value===undefined || value === null) {
			return value;
		}
		let rt = null;
		let offset = null;
		switch(type) {
		case SqlType.integer:
		case SqlType.varchar:
		case SqlType.decimal:
		case SqlType.float:
		case SqlType.clob:
			return value;
		case SqlType.timestamp:
			offset = value.getTimezoneOffset();
			value = new Date(value.getTime() - (offset*60*1000));
			rt = value.toISOString();
			rt = rt.substring(0, rt.length - 1);
			return rt;
		case SqlType.date:
			offset = value.getTimezoneOffset();
			value = new Date(value.getTime() - (offset*60*1000));
			rt = value.toISOString().split("T")[0];			
			return rt;
		case SqlType.time:
			return value;
		case SqlType.blob:	
			return value.toString();
		default:
			return value;
		}
	}
}