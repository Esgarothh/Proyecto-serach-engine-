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

module.exports = client;
var metodos = require("./metodos");

const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("What is your name ? ", function (name) {
	let dato = {
		site: [name],
	};
	console.log(name);
	metodos.searchbyword(dato.site);
});

rl.on("close", function () {
	console.log("\nBYE BYE !!!");
	process.exit(0);
});
