const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./site.proto";

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
module.exports = cliente;
