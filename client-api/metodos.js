const client = require("./client");

client.getAllSite({}, (error, site) => {
	if (!error) {
		console.log("successfully fetched todo lists");
		console.log(JSON.stringify(site, null, 4));
	}
});
