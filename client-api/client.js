const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = ".././site.proto";

const http = require("http");
const webclient = require("./client");

const host = "localhost";
const port = 8000;

const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const SiteService = grpc.loadPackageDefinition(packageDefinition).SiteService;

const client = new SiteService(
	"localhost:50051",
	grpc.credentials.createInsecure()
);

const Redis = require("ioredis");

const redisClient = new Redis.Cluster([
	{
		port: 8000,
		host: "172.20.0.31",
	},
	{
		port: 8001,
		host: "172.20.0.32",
	},
	{
		port: 8002,
		host: "172.20.0.33",
	},
	{
		port: 8003,
		host: "172.20.0.34",
	},
	{
		port: 8004,
		host: "172.20.0.35",
	},
	{
		port: 8005,
		host: "172.20.0.36",
	},
]);
const getSitioBy = async (word) => {
	const value = await redisClient.get(word);

	console.log(value);
	// Disconnect from Redis.
};

const setValue = async (key, value) => {
	// Set key "myname" to have value "Simon Prickett".
	await redisClient.set(key, value);

	redisClient.quit();
};

const existe = async (key) => {
	// Set key "myname" to have value "Simon Prickett".
	await redisClient.set("myname", "Simon Prickett");
	const ret = await redisClient.exists(key);
	let tipo = typeof ret;
	console.log("ret=" + ret + "tipo:" + tipo);
	if (ret === 0) {
		console.log("ret falso");
		return false;
	}
	console.log("ret true");
	return true;
};

const consultando = async (req, res) => {
	const reply = await client.get(req);
	if (reply) return res.send(JSON.parse(reply));

	// consulto a base de datos si no esta en cache.

	// Saving the results in Redis.
	const saveResult = await client.set(
		"character",
		JSON.stringify(response.data)
	);
	console.log(saveResult);
	// resond to client
	res.send(response.data);
};

const redisDemo = async (word) => {
	// Set key "myname" to have value "Simon Prickett".
	await redisClient.set("myname", "Simon Prickett");

	// Get the value held at key "myname" and log it.
	const value = await redisClient.get(word);
	console.log(value);
	const value2 = await redisClient.set("nombre", "matias");
	console.log(value2);
	// Disconnect from Redis.
	redisClient.quit();
};
module.exports = client;
var metodos = require("./metodos");

const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("Buscar por keyword: ? ", function (name) {
	let dato = {
		site: [name],
	};
	let ret;
	const resultado = existe(name);
	(async () => {
		ret = await resultado;

		if (ret === true) {
			console.log("entre");
			getSitioBy(name);
		} else {
			console.log("hola:" + name);
			let query = metodos.searchbyword(dato.site);
			console.log(query);
			setValue(name, JSON.stringify(query));
		}
	})();
});

rl.on("close", function () {
	console.log("\nBYE BYE !!!");
	process.exit(0);
});
