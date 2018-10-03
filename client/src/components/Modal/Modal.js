import React, { Component } from "react";
import API from "../../utils/App.js";
import $ from "jquery";


class Modal extends Component {

	state = {
		categories: [],
		currentDate: new Date()
	};

	componentDidMount() {
		this.retrieveBudget();
	};


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
	      		<div className="form-top">
		      		<div className="modal-input">
			        	<h4>Category</h4>
		        		<select id="show" className="categories">
		        			<option value="other">Other</option>
				        	{this.props.categories.map (category => (
								<option key={category.index} value={category.title}
									>{category.title}</option>
				        	))}
				        </select>
					</div>
					<div className="modal-input">
		      		<h4>Transaction Type</h4>
						<div className="single-select">
						  <div className="selection">
						    <input id="expense" value="expense" name="type" type="radio" defaultChecked/>
						    <label htmlFor="expense">Expense</label>
						  </div>
					  <div className="selection">
					    <input id="income" value="income" name="type" type="radio" />
					    <label htmlFor="income">Income</label>
					  </div>
					</div>
		      		</div>
				</div>
				<div className="form-bottom">
			        <div className="modal-input item-amount">
			        	<div className="item-amount-input">
			        		<h4>Item</h4>
				        	<label className="visually-hidden" htmlFor="item">Item</label>
				        	<input id="item" name="item" type="text" />
				        </div>
				        <div className="item-amount-input">
				        	<h4>Amount</h4>
				        	<label className="visually-hidden"  htmlFor="amount">Amount</label>
				        	<input id="amount" name="amount" type="text" />
				        </div>
			        </div>
					<div className="modal-input">
						<h4>Purchase Satisfaction</h4>
						<div className="clearfix modal-input">
							<div className="single-select">
	      					<div className="selection">
						        <input name="happy" type="radio" value="yes" id="yes"  defaultChecked />
						        <label htmlFor="yes"><span className="hide">Yes</span> <i className="material-icons">thumb_up</i></label>
					     	</div>
	    					<div className="selection">
	        					<input name="happy" type="radio" value="no" id="no"  />
	        					<label htmlFor="no"><span className="hide">No</span><i className="material-icons">thumb_down</i></label>
							</div>
							</div>
						</div>
					</div>
				</div>
				<div className="form-end">
					 <input type="date"  className="datepicker"/>
				</div>
				<div> 
	        		<button className="btn" onClick={this.props.submitTransaction}>Submit</button>
	        	</div>
	        </form>
	      </section>
	    </div>
	  );
  }

};

export default Modal;