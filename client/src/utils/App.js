import axios from "axios";

export default {


  searchUser: function() {
    return axios.get("/profile");
  },


};
