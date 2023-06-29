import { Connection } from "db-conn";
import { MySqlConnectionConfig } from "../MySqlConnectionConfig.js";
import { MySqlDriver } from "../MySqlDriver.js";

const driver = new MySqlDriver();
const config: MySqlConnectionConfig = {
	host: 'localhost',
	user: 'root',
	database: 'db1',
	password:'12345678'
};

let conn: Connection;
conn = await driver.connect(config);
let rt = await conn.executeQuery("SELECT * FROM `ORDR`");
console.debug(rt);
await conn.close();