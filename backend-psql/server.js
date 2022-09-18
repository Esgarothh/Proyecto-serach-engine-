const grpc = require("@grpc/grpc-js");
const PROTO_PATH = ".././site.proto";
var protoLoader = require("@grpc/proto-loader");
const { response } = require("express");
//docker run --name local-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mypassword -e POSTGRES_USER=admin -d postgres
const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};
const { Client } = require("pg");
const client = new Client({
	host: "172.17.0.1",
	database: "my_database",
	user: "my_user",
	password: "password123",
	port: 5432,
});
client.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const siteProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let dato = {
	array: [],
};

function get_info(callback) {
	var sql = "SELECT * FROM datos WHERE id=30";

	client.query(sql, function (err, results) {
		if (err) {
			throw err;
		}
		stuff_i_want = results.rows[0]; //
		return callback(stuff_i_want);
	});
}

function DBsearchKeyword(word, callback) {
	var sql = "SELECT id FROM keywords WHERE keyword='" + word + "'";

	client.query(sql, function (err, results) {
		if (err) {
			throw err;
		}
		console.log(results.rows);
		stuff_i_want = results.rows; //
		return callback(stuff_i_want);
	});
}

//usage

server.addService(siteProto.SiteService.service, {
	getAllSite: (_, callback) => {
		dato.array.push({ id: "3" });
		callback(null, dato);
	},
	getOneSite: (_, callback) => {
		let stuff = { array: [] };

		get_info(function (result) {
			stuff.array.push(result);
			callback(null, stuff);

			//rest of your code goes in here
		});
		//console.log("i got this:" + stuff);
		//dato = dato.array.push(stuff_i_want);
		//callback(null, dato);
	},
	searchByWord: (call, callback) => {
		let stuff = { array: [] };
		word = call.request.word;
		DBsearchKeyword(word, function (result) {
			result.forEach(function (item, index) {
				stuff.array.push(item);
			});

			console.log(stuff);
			callback(null, stuff);
		});
	},
});

server.bindAsync(
	"127.0.0.1:50051",
	grpc.ServerCredentials.createInsecure(),
	(error, port) => {
		console.log("Server running at http://127.0.0.1:50051");
		server.start();
	}
);
