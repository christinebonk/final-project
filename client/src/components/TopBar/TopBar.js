import React from "react";

const TopBar = (props) => (
	<header className="top-bar">
		<h1>{props.title}</h1>
		{props.children}
    </header>
);

export default TopBar;