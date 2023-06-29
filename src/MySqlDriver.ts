import { Driver, Connection } from "db-conn";
import { MySqlConnection } from "./MySqlConnection.js";
import { MySqlConnectionConfig } from "./MySqlConnectionConfig.js";

import * as mysql2 from 'mysql2';

export class MySqlDriver implements Driver {
	public async connect(config: MySqlConnectionConfig): Promise<Connection> {
		const _conn = mysql2.createConnection(config);
		const rt = new MySqlConnection(_conn);
		return rt;
	}
}