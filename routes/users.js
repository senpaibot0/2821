var express = require('express');
var router = express.Router();
const { getConnection, sql } = require('../SQLServerDB/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



// Example route to fetch users
router.get('/', async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM Users');
  res.json(result.recordset);
});

module.exports = router;


