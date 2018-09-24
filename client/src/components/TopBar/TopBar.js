import React, { Component } from "react";
import Modal from "../Modal/";
import $ from "jquery";
import API from "../../utils/App.js";


class TopBar extends Component {
	state = {
        show: false,
        categories: []
    }

    showModal = () => {
        this.setState({ show: true });
        this.retrieveBudget();
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    submitTransaction = (event) => {
    	event.preventDefault();
    	this.setState({ show: false });
		const item = $("#item").val().trim();
		const cost = $("#amount").val().trim();
		const category = $('.categories').val().trim();
		const date = new Date();
		const subcategory = $('input[name=type]:checked').val();
		let happy = $('input[name=happy]:checked').val();
		if (happy === "yes") { happy = true } else {happy = false };
		const data = {
			item: item,
			cost: cost, 
			category: category,
			date: date,
			subcategory: subcategory,
			happy: happy
		}
		API.submitTransaction(data);
	}

	retrieveBudget = () => {
		API.searchBudget()
    	.then(res => {
    	//create budget object
    	let budgetData = res.data.filter(entry => entry.type !== "income" && entry.period === "monthly");

      budgetData = budgetData.map((entry, index) => {
        let obj = {
          title: entry.name,
          index: index
        }
        return obj
        });


    this.setState({categories: budgetData}, () => {
    })})

  	}

	render () {
		return (
			<header className="top-bar">
				<div className="title-container">
					<h1>{this.props.title}</h1>
	            </div>
              	<div className="nav-bar">
              		<ul>
              			<li>
              				<a href="/">
	              				<i className="material-icons">trending_up</i>
	              				<figcaption>FI Dashboard</figcaption>
              				</a>
              			</li>
              			<li>
              				<a onClick={this.showModal}>
              					<i className="material-icons" onClick={this.showModal}>add_circle</i>
              					<figcaption>Add Transaction</figcaption>
              				</a>
              			</li>
              			<li>
              				<a href="/overview">
              					<i className="material-icons">pie_chart</i>
              					<figcaption>Budget</figcaption>
              				</a>
              			</li>
              			<li>
              				<a href="/monthly">
              					<i className="material-icons">timeline</i>
              					<figcaption>Monthly</figcaption>
              				</a>
              			</li>
              		</ul>
              	</div>
              	<main>
                    <Modal show={this.state.show} handleClose={this.hideModal} submitTransaction={this.submitTransaction} categories={this.state.categories}>
                    </Modal>  
              	</main>

    		</header>
		)
		
	}


}

	

	


export default TopBar;