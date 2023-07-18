# MySQL implementation of db-conn (JDBC Like)

## Connect to datanase
```
const config: MySqlConnectionConfig = {
	host: 'localhost',
	user: 'root',
	database: 'test',
	password:'*******'
};
let conn = await driver.connect(config);
let data = await conn.executeQuery("select 1 from dual");
await conn.close();
```

## Connection Pool
```
const config = {
        host: 'localhost',
        user: 'root',
        database: 'test',
        password: '******'
};
const oPool = new MySqlDataSource(config);
const conn = await oPool.getConnection();
await conn.close();
await oPool.close();
```