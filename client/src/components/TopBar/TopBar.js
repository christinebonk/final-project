import React, { Component } from "react";
import Modal from "../Modal/"

class TopBar extends Component {
	state = {
        show: false
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

	render () {
		return (
			<header className="top-bar">
				<h1>{this.props.title}</h1>
				{this.props.children}
				<button type="button" onClick={this.showModal}>
                      open
                </button>
                <main>
                    <Modal show={this.state.show} handleClose={this.hideModal}>
                      <p>Modaaslkdjflkasjfklsajfkljdsklafjalksjfaklsjfklsjl</p>
                      <p>Data</p>
                    </Modal>
                    
              </main>
    		</header>
		)
		
	}


}

	

	


export default TopBar;