import React, { Component } from "react";

class Modal extends Component {

	retrieveBudget = () => {
		console.log("hello");
  }
  

  render() {
  	const showHideClassName = this.props.show ? "display-block" : "display-none";
	  	return (
	    <div className={showHideClassName}>
	      <section className="modal-main">
	        {this.props.children}
	        <label for="item">Label</label>
	        <input id="item" name="item" type="text" />
	        <button onClick={this.props.handleClose}>close</button>
	      </section>
	    </div>
	  );
  }

};

export default Modal;