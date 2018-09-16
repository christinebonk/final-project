import React from "react";

export const UpdateBox = (props) => (
	<div className="update-block">
		<h4>{props.title}</h4>
		<p>{props.amount}</p>
		{props.children}
    </div>
);
