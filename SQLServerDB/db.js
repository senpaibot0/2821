const sql = require('mssql');

const config = {
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  server: 'localhost', // You can use localhost\\instance_name if it's a local SQL Server
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for Azure SQL, set to false if you're not on Azure
    trustServerCertificate: true // change to false for production if not using a trusted certificate
  }
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('SQL Connection Error: ', err);
  }
}

module.exports = {
  getConnection,
  sql // exporting sql to use SQL types in queries if necessary
};
