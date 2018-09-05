//enable materialize modal
$('.modal').modal();

//enable materialize datepicker
$('.datepicker').datepicker({
	selectMonths: true,
	selectYears: false,
	disable: true
});

//goals
$(".goals-submit").on("click", function(event) {
	event.preventDefault();
	var date = $("#date").val().trim();
	var amount = $("#retirement-amount").val().trim();
	var currentDate = new Date();
	var error = false;

	//validations
	if (!date) {
		$("#date-error").text("Please enter a value");
		error = true;
	} else if (currentDate > new Date(date)) {
		console.log("error")
		$("#date-error").text("Please enter a date in the future");
		error = true;
	} 

	if (!amount) {
		$("#retirement-amount-error").text("Please enter a value");
		error = true;
	} else if (isNaN(amount)) {
		$("#retirement-amount-error").text("Entry must be a number");
		error = true;
	} else if (amount.length > 40) {
		$("#retirement-amount-error").text("Entry must be 40 characters or fewer");
		error = true;
	} else if (amount < 0) {
		$("#retirement-amount-error").text("Entry must be greater than zero");
		error = true;
	}
	if (error) {
		return
	}

	$.ajax("/profile", {
		type: "PUT",
		data: {
			date: date,
			amount: amount
		}
	}).then(function(res) {
		window.location.href = "/networth";
	})
});



//networth
$(".asset-button").on("click", function(event) {
	event.preventDefault();
	$("#account-balance-error").empty();
	$("#account-name-error").empty();
	var category = $(this).attr("id");
	$(".modal-save").attr("data-category", category);
	$("#account-type").text(category);
});


$(".modal-save").on("click", function(event) {
	event.preventDefault();
	var category = $(this).attr("data-category");
	var name = $("#account-name").val().trim();
	var balance = $("#account-balance").val().trim();
	var include = $("input[name='fire']:checked").val().trim();
	var error = false;



	if (include === "yes") {
		include = true;
	} else {
		include = false;
	}


	//validations
	if (category === "mortgage" || category === "student-loan" || category === "other-debt") {
		if (balance > 0) {
			$("#account-balance-error").text("Please enter a negative number");
				error = true;
		} 
	} else {
		if (balance < 0) {
			$("#account-balance-error").text("Please enter a positive number");
				error = true;
		} 
	}

	if(balance.length === 0) {
		$("#account-balance-error").text("Please enter an account balance");
		error = true;
	} else if (isNaN(balance)) {
		$("#account-balance-error").text("Account balance must be a number");
		error = true;
	} else if (balance.length > 40) {
		$("#account-balance-error").text("Account balance must be 40 characters or fewer");
		error = true;
	}

	if(name.length === 0) {
		$("#account-name-error").text("Please enter an account name");
		error = true;
	} else if (name.length > 40) {
		$("#account-name-error").text("Account name must be 40 characters or fewer");
		error = true;
	}
	if (error) {
		return
	}

	var account = {
		type: category,
		account: name,
		balance: balance,
		include: include
	}
	console.log(account);

	$.ajax("/account", {
		type: "POST",
		data: account
	}).then(function(res) {
		//TO DO: need to close modal 
	})
})