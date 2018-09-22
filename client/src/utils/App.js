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
	}


};
