import * as mysql from 'mysql2';

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'db1',
  password:'12345678'
});

// simple query
connection.query(
  'SELECT * FROM `ORDR`',
  function(err, results, fields) {
    console.log(results);
    console.log(fields);
  }
);
