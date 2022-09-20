const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = ".././site.proto";
const http = require("http");
const webclient = require("./index.controller.js");
const host = "localhost";
const port = 8000;
const Redis = require("ioredis");
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

const setValue = async (key, value) => {
	await redisClient.set(key, value);
};
const getSitioBy = async (word) => {
	const value = await redisClient.get(word);

	console.log(value);
	return value;
	// Disconnect from Redis.
};

const existe = async (key) => {
	+console.log("hello");
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

const cleanCache = async (word) => {
	await redisClient.flushall();
};
module.exports = client;
var metodos = require("./metodos");

const readline = require("readline");
const { type } = require("os");
const { timeout } = require("nodemon/lib/config/index.js");


const searchitems = async (req, res) => {
	let searchbox =
		'<div class="search-container"><form action="/search" method="POST"><input type="text" placeholder="Search.." name="q"> <button type="submit">Submit</button> </form> </div>';
	let tiempoinicial = Date.now();
	if (req.method === "POST" && req.body.q != "") {
		let name = req.body.q;
		let dato = {
			site: [name],
		};
		let estring = "";
		estring = name;
		let jeison = {};
		const ret = await existe(name);

		console.log(ret);
		if (ret === true) {
			console.log("entre");
			let retorno = await getSitioBy(estring);
			let tiempofinal = Date.now() - tiempoinicial;
			let lineacache =
				searchbox +
				"<h1>" +
				tiempofinal +
				" Busqueda realizada en cache:</h1>" +
				retorno;
			res.set("Content-Type", "text/html");
			return res.status(200).send(Buffer.from(lineacache));
		} else {
			console.log("hola:" + name);
			let send = { word: [] };
			send.word.push(name);

			client.searchByWord({ word: name }, (error, items) => {
				if (!error) {
					data = JSON.stringify(items.array);
					console.log(data);
					if (data["product"] !== null && items.array.length != 0) {
						setValue(name, data);
						let a = "";
						items.array.forEach(function (item, index) {
							pararetornar = item;
							let end = "</table>";
							let id = JSON.stringify(item.id);
							let titulo = JSON.stringify(item.titulo);
							let descripcion = JSON.stringify(item.descripcion);
							let url = JSON.stringify(item.url);
							let start =
								"<li><h3>" +
								titulo +
								"</h3><p>" +
								descripcion +
								"</p><a>" +
								url +
								"</a></li>";
							a += start;
						});
						let tiempofinal = Date.now() - tiempoinicial;
						let linea =
							searchbox +
							"<h1>" +
							tiempofinal +
							" Busqueda realizada en bdd:</h1>" +
							a;
						res.set("Content-Type", "text/html");
						return res.status(200).send(Buffer.from(linea));
					} else {
						let linea = searchbox + "<h1> No existen resultados:</h1>";
						res.set("Content-Type", "text/html");
						return res.status(200).send(Buffer.from(linea));
					}
				}
				res.status(400).json(error);
			});
		}
	} else {
		let linea =
			'<div class="search-container"><form action="/search" method="POST"><input type="text" placeholder="Search.." name="q"> <button type="submit">Submit</button> </form> </div>';
		res.set("Content-Type", "text/html");
		return res.status(200).send(Buffer.from(linea));
	}
};
const borrarcache = async (req, res) => {
	cleanCache();
	return res.status(200).json("borrada");
};

module.exports = {
	searchitems,
	borrarcache,
};
