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

const defaultFields = ['id', 'DATE_FORMAT(time, \'%Y/%m/%d %H:%i\') as time', 'path', 'boss', 'accountname', 'class', 'bossdps', 'cleavedps', 'bosstime'];
function handleGET(req, res) {
		const query = url.parse(req.url, true).query;
		const boss = encodeURIComponent(query['boss']);
		const classname = encodeURIComponent(query['class']);

		let where = `WHERE boss="${boss}"`
		if (classname && classname != 'all') {
			where += ` AND class="${classname}"`;
		}

		const sql = `
			SELECT ${defaultFields.join(',')}
			FROM dpsdata
			${where}
			ORDER BY bossdps DESC
			LIMIT 60;
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
		const data_list = JSON.parse(body);
    const values = data_list.map(data => {
      Object.keys(data).forEach(key => data[key] = encodeURIComponent(data[key]));
      return `(
        STR_TO_DATE("${data['time']}", "%Y%m%d-%H%i%s"),
        "${data['path']}",
        "${data['bossname']}",
        "${data['accountname']}",
        "${data['class']}",
        ${data['bossdmg']},
        ${data['cleavedmg']},
        ${data['bosstime']}
      )`
    })

    const sql = `
      INSERT INTO dpsdata(time,path,boss,accountname,class,bossdps,cleavedps,bosstime)
      VALUES ${values.join(',')};
    `;

    pool.query(sql, function (error, results, fields) {
      if (error) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Something went wrong internally.");
        throw error;
      }
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.end("OK");
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
}).listen(8082, 'localhost');
console.log('/api/dpsdata starting up');
