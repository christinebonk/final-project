import React, { Component } from "react";
import API from "../../utils/App.js";
import $ from "jquery";


class Modal extends Component {

	state = {
		categories: []
	};

	componentDidMount() {
		this.retrieveBudget();
	};

	submitTransaction(event) {
		event.preventDefault();
		const item = $("#item").val().trim();
		const cost = $("#amount").val().trim();
		const category = $('.categories').val().trim();
		const date = new Date();
		const subcategory = $('input[name=type]:checked').val();
		let happy = $('input[name=happy]:checked').val();
		if (happy === "yes") { happy = true } else {happy = false }

		const data = {
			item: item,
			cost: cost, 
			category: category,
			date: date,
			subcategory: subcategory,
			happy: happy
		}

		API.submitTransaction(data)

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
  

  render() {
  	const showHideClassName = this.props.show ? "display-block" : "display-none";
	  	return (
	    <div className={showHideClassName}>
	      <section className="modal-main">
	      <i onClick={this.props.handleClose} className="close-icon material-icons">close</i>
	      <h2>Add Transaction</h2>
	      	<form>
	      		<div className="clearfix type-input modal-input">
					<div className="single-select">
					  <div className="selection">
					    <input id="expense" name="type" type="radio" defaultChecked/>
					    <label htmlFor="expense">Expense</label>
					  </div>
				  <div className="selection">
				    <input id="income" name="type" type="radio" />
				    <label htmlFor="income">Income</label>
				  </div>
				</div>
	      		</div>
		        <div className="modal-input">
		        	<label htmlFor="item">Item</label>
		        	<input id="item" name="item" type="text" />
		        </div>
		        <div className="modal-input">
		        	<label htmlFor="amount">Amount</label>
		        	<input id="amount" name="amount" type="text" />
		        </div>
		        <div className="modal-input">
		        		<select id="show" className="categories">
		        			<option value="other">Other</option>
				        	{this.props.categories.map (category => (
								<option key={category.index} value={category.title}
									>{category.title}</option>
				        	))}
				        </select>
					
				</div>
				<div className="modal-input">
					<legend>Are you happy with this purchase?</legend>
	      			<p>
				      <label>
				        <input name="happy" type="radio" value="yes" defaultChecked />
				        <span>Yes</span>
				      </label>
				    </p>
				    <p>
				      <label>
				        <input name="happy" type="radio" value="no"  />
				        <span>No</span>
				      </label>
				    </p>
	      		</div>
				<div> 
	        		<button onClick={this.props.handleClose}>close</button>
	        		<button onClick={this.props.submitTransaction}>Submit</button>
	        	</div>
	        </form>
	      </section>
	    </div>
	  );
  }

};

export default Modal;