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
	        <button onClick={this.props.handleClose}>close</button>
	        <button onClick={this.retrieveBudget}>close</button>
	      </section>
	    </div>
	  );
  }

};

export default Modal;