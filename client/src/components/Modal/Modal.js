import React, { Component } from "react";
import API from "../../utils/App.js";
import $ from "jquery";


class Modal extends Component {

	state = {
		categories: [],
		test: 0
	};

	componentDidMount() {
		this.retrieveBudget();
		console.log(this.state.categories);
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

    console.log(budgetData);

    this.setState({categories: budgetData}, () => {
    	console.log(this.state.categories);
    })})

  	}
  

  render() {
  	const showHideClassName = this.props.show ? "display-block" : "display-none";
	  	return (
	    <div className={showHideClassName}>
	      <section className="modal-main">
	      	<form>
	      		<div className="modal-input">
	      			<p>
				      <label>
				        <input name="type" type="radio" value="expense" defaultChecked />
				        <span>Expense</span>
				      </label>
				    </p>
				    <p>
				      <label>
				        <input name="type" type="radio" value="income"  />
				        <span>Income</span>
				      </label>
				    </p>
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
				        	{this.state.categories.map (category => (
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
	        		<button onClick={this.submitTransaction}>Submit</button>
	        	</div>
	        </form>
	      </section>
	    </div>
	  );
  }

};

export default Modal;