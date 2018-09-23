import axios from "axios";

export default {

	searchAccount: function() {
		return axios.get("/account")
	},

	searchUser: function() {
		return axios.get("/profile");
	},

	searchBudget: function() {
		return axios.get("/api/income");
	},

	submitTransaction: function(transaction) {
		return axios.post("api/transaction", transaction)
	},

	searchTransaction: function() {
		return axios.get("api/transaction")
	},

	submitUser: function(profile) {
		return axios.put("/profile", profile)
	},

	submitBudget: function(data) {
		return axios.put("/api/budget", data)
	},

	deleteBudget: function(id) {
		return axios.delete("/api/budget/" + id)
	},

	addBudget: function(data) {
		return axios.post("/api/budget", data)
	},

	submitAccount: function(data) {
		return axios.put("/api/account", data)
	}


};
