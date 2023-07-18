import { MySqlConnectionConfig } from "../MySqlConnectionConfig.js";
import { MySqlDriver } from "../MySqlDriver.js";

const driver = new MySqlDriver();

const config: MySqlConnectionConfig = {
	host: 'localhost',
	user: 'root',
	database: 'test',
	password:'12345678'
};

test('select', async () => {
	let conn = await driver.connect(config);
	let data = await conn.executeQuery("select 1 from dual");
	expect(data).toStrictEqual([{1:1}]);
	await conn.close();
});