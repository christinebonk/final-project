//enable materialize modal
$('.modal').modal();

//enable materialize datepicker
$('.datepicker').datepicker({
	selectMonths: true,
	format: "mmmm",
	selectYears: false,
	disable: true
});

$(".asset-button").on("click", function(event) {
	event.preventDefault();
	var category = $(this).attr("id");
	$(".modal-save").attr("data-category", category);
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

	if (isNaN(balance)) {
		$("#account-balance-error").text("Account balance must be a number");
		error = true;
	} else if (balance.length > 40) {
		$("#account-balance-error").text("Account balance must be 40 characters or fewer");
		error = true;
	}
	if (name.length > 40) {
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