import { Connection } from "db-conn";
import { MySqlConnectionConfig } from "../MySqlConnectionConfig.js";
import { MySqlDriver } from "../MySqlDriver.js";

const driver = new MySqlDriver();

const config: MySqlConnectionConfig = {
	host: 'localhost',
	user: 'root',
	database: 'test',
	password:'12345678'
};

let conn: Connection;
beforeEach(async() =>  {
	conn = await driver.connect(config);
});
afterEach(async() => {
	await conn.close();
});
test('select', async () => {
	conn.setAutoCommit(true);
	let data = await conn.executeQuery("select 1 from dual");
	expect(data).toStrictEqual([{1:1}]);
});
test('wrong select', async () => {
	let error = false;
	try {
		await conn.executeQuery("drop table if exists test");
	} catch (e) {
		error = true;
	}
	expect(error).toStrictEqual(true);

});
test('insert', async () => {
	await conn.setAutoCommit(true);
	await conn.execute("drop table if exists test");
	await conn.execute("create table test (id int, data varchar(20), primary key(id))");
	let data = await conn.execute("insert into test(id,data) values(?,?)",[1,'a']);
	expect(data.affectedRows).toStrictEqual(1);
	await conn.close();
	conn = await driver.connect(config);
	let data2 = await conn.executeQuery("select * from test");
	expect(data2).toStrictEqual([ {id:1,data:'a'} ]);
});
test('commit', async () => {
	await conn.setAutoCommit(false);
	await conn.execute("drop table if exists test");
	await conn.execute("create table test (id int, data varchar(20), primary key(id))");
	let data = await conn.execute("insert into test(id,data) values(?,?)",[1,'a']);
	expect(data.affectedRows).toStrictEqual(1);
	await conn.commit();
	let data2 = await conn.executeQuery("select * from test");
	expect(data2).toStrictEqual([ {id:1,data:'a'} ]);
});
test('rollback', async () => {
	await conn.setAutoCommit(false);
	await conn.execute("drop table if exists test");
	await conn.execute("create table test (id int, data varchar(20), primary key(id))");
	let data = await conn.execute("insert into test(id,data) values(?,?)",[1,'a']);
	expect(data.affectedRows).toStrictEqual(1);
	await conn.rollback();
	let data2 = await conn.executeQuery("select * from test");
	expect(data2).toStrictEqual([]);
});