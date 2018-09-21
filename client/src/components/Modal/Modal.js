import React, { Component } from "react";
import API from "../../utils/App.js";


class Modal extends Component {

	state = {
		categories: [],
		test: 0
	};

	componentDidMount() {
		this.retrieveBudget();
		console.log(this.state.categories);
	  };

	submitTransaction() {
		
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
	        {this.props.children}
	        <div className="modal-input">
	        	<label htmlFor="item">Item</label>
	        	<input id="item" name="item" type="text" />
	        </div>
	        <div className="modal-input">
	        	<label htmlFor="amount">Amount</label>
	        	<input id="amount" name="amount" type="text" />
	        </div>
	        <div className="modal-input">
	        		<select id="show">
	        			<option value="other">Other</option>
			        	{this.state.categories.map (category => (
							<option value={category.title}
								>{category.title}</option>
			        	))}
			        </select>
				
			</div>
			<div> 
	        <button onClick={this.props.handleClose}>close</button>
	        </div>
	      </section>
	    </div>
	  );
  }

};

export default Modal;