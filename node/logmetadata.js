#!/usr/bin/env nodejs
const http = require('http');
const mysql = require('mysql');
const url = require('url');

const pool = mysql.createPool({
	connectionLimit: 4,
  host: 'localhost',
  user: 'rw_user',
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

function handleGET(req, res) {
		const query = url.parse(req.url, true).query;
		const fieldsSet = new Set(query['fields'] ?
			query['fields']
				.trim()
				.split(',')
				.map(field => encodeURIComponent(field.trim()))
				.filter(field => validFields.has(field))
			: []
		);
		defaultFields.forEach(field => fieldsSet.add(field));

		// implicit getall
		const fields = [...fieldsSet].join(',');
		let where = `WHERE 1=1`
		if (query['guild']) {
			where += ` AND guild="${encodeURIComponent(query['guild'])}"`;
		}
		const sql = `
			SELECT ${fields}
			FROM logmetadata
			${where}
			ORDER BY time DESC
			LIMIT 50;
		`;

		pool.query(sql, function (error, results, fields) {
			if (error) {
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end("Something went wrong internally.");
				throw error;
			}
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(results));
		});
}

function handlePUT(req, res) {
	var body = [];
	req.on('data', function(chunk) {
	  body.push(chunk);
	}).on('end', function() {
	  body = Buffer.concat(body).toString();
		const data = JSON.parse(body);
		Object.keys(data).forEach(key => data[key] = encodeURIComponent(data[key]));

		const sql = `
			INSERT INTO logmetadata(path,time,boss,bosstime,name,guild,class,cleavedmg,bossdmg,rank,people)
			VALUES (
				"${data['path']}",
				NOW(),
				"${data['boss']}",
				${data['bosstime']},
				"${data['name']}",
				"${data['guild']}",
				"${data['class']}",
				${data['cleavedmg']},
				${data['bossdmg']},
				${data['rank']},
				${data['people']}
			);
		`;

		pool.query(sql, function (error, results, fields) {
			if (error) {
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end("Something went wrong internally.");
				throw error;
			}
			res.writeHead(201, {'Content-Type': 'text/plain'});
			res.end("Created");
		});
	});
}

http.createServer(function (req, res) {
		if (req.method === "GET") {
			return handleGET(req, res);
		} else if (req.method === "PUT") {
			return handlePUT(req, res);
		} else {
			res.writeHead(405, {'Content-Type': 'text/plain'});
		  res.end(`Method ${req.method} not supported.`);
		}
}).listen(8081, 'localhost');
console.log('/api/logmetadata starting up');
