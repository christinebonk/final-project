import axios from "axios";

export default {

	searchAccount: function() {
		return axios.get("/account")
	},

	searchUser: function() {
		return axios.get("/profile");
	},


};
