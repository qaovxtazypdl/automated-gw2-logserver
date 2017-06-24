#!/usr/bin/env nodejs
const http = require('http');
const mysql = require('mysql');
const url = require('url');

const pool = mysql.createPool({
	connectionLimit: 4,
  host: 'localhost',
  user: 'ro_user',
  database: 'logs'
});

const defaultFields = ['id', 'DATE_FORMAT(time, \'%d/%m/%Y\') as time', 'path', 'boss', 'class', 'bosstime'];
const validFields = new Set([
	'id',
	'path',
	'boss',
	'bosstime',
	'name',
	'guild',
	'class',
	'cleavedmg',
	'bossdmg',
	'rank',
	'people'
]);

http.createServer(function (req, res) {
		const query = url.parse(req.url, true).query;
		const fieldsSet = new Set(query['fields'] ?
			query['fields']
				.trim()
				.split(',')
				.map(field => encodeURIComponent(field).trim())
				.filter(field => validFields.has(field))
			: []
		);
		defaultFields.forEach(field => fieldsSet.add(field));

		// implicit getall
		const fields = [...fieldsSet].join(',');
		const sql = `
			SELECT ${fields}
			FROM logmetadata
			WHERE boss="${query['boss']}"
			LIMIT 25;
		`;
		pool.query(sql, function (error, results, fields) {
			if (error) throw error
			res.writeHead(200, {'Content-Type': 'text/plain'});
		  res.end(JSON.stringify(results));
		});
}).listen(8081, 'localhost');
console.log('/api/logmetadata starting up');
