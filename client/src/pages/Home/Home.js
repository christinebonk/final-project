import React, { Component } from "react";
import API from "../../utils/App.js";


class Home extends Component {

  componentDidMount() {
    this.loadBooks();
  }
 
  loadBooks = () => {
    API.searchUser()
      .then(res => console.log(res)
      )
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
       <h1>Hi</h1>
      </div>
      );
  }

}



         
                  



export default Home;
