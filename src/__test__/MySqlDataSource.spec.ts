import { MySqlDataSource } from "../MySqlDataSource.js";

test('datasource - pool', async () => {
	const config = {
			host: 'localhost',
			user: 'root',
			database: 'test',
			password: '12345678'
	};
	const oPool = new MySqlDataSource(config);
	const conn1 = await oPool.getConnection();
	const conn2 = await oPool.getConnection();
	await conn2.close();
	await conn1.close();
	await oPool.close();
});
test('datasource - pool', async () => {
	const config = {
			host: 'localhost',
			user: 'root',
			database: 'test',
			password: '12345678'
	};
	const oPool = new MySqlDataSource(config);
	const conn1 = await oPool.getConnection();
	const conn2 = await oPool.getConnection();
	const data = await conn1.executeQuery("select 1 from dual");
	expect(data).toStrictEqual([{1:1}]);
	await conn2.close();
	await conn1.close();
	await oPool.close();
});