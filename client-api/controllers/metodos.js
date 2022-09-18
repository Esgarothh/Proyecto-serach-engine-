let client = require("./index.controller");
module.exports = {
	getallsite: function () {
		return client.getAllSite({}, (error, site) => {
			if (!error) {
				console.log("successfully fetched todo lists");
				console.log(JSON.stringify(site, null, 4));
			}
		});
	},

	getonesite: function () {
		return client.getOneSite({}, (error, site) => {
			if (!error) {
				console.log(site.array[0]);
			} else console.log(error);
		});
	},
	searchbyword: function (word) {
		return client.searchByWord({ word }, (error, site) => {
			if (!error) {
				let pararetornar = "";
				values = site.array;
				values.forEach(function (item, index) {
					pararetornar = item;
				});
				return "retorno";
			} else console.log(error);
		});
	},
};
