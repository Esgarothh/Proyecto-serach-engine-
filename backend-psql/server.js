const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./site.proto";
var protoLoader = require("@grpc/proto-loader");
//docker run --name local-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mypassword -e POSTGRES_USER=admin -d postgres
const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const siteProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let dato = {
	site: [
		{
			id: "1",
			titulo: "Wikipedia",
			descripcion: "Content 1",
			url: "www.wikipedia.org",
		},
		{
			id: "2",
			titulo: "Facebook",
			descripcion: "Content 2",
			url: "facebook.com",
		},
	],
};
server.addService(siteProto.SiteService.service, {
	getAllSite: (_, callback) => {
		callback(null, dato);
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
