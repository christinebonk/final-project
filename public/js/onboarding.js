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
});

$.ajax("/account", {
	type: "GET"
}).then(function(res) {

	res.forEach(function(element) {
		var row = $("<tr>");
		var account = $(`<td>${element.account}</td>`);
		var balance = $(`<td>${element.balance}</td>`);
		var type = $(`<td>${element.type}</td>`);
		row.append(account, balance, type);
		$("#networth-table").append(row);
	})
})

//range slider
$("#retirement-amount").change(function() {
	var amount = $(this).val();
	amount = amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	$(".rangeValue").text(amount);
})

//budget 

var expenseCategories = ["Housing", "Phone", "Transportation", "Groceries", "Gym", "Discretionary", "Utilities", "Gas", "Student Loans"];
var savingsCategories = ["Financial Independence Savings", "Emergency Fund", "Travel", "Holidays", "Gifts", "Down Payment"];

function generateCategories(array, type) {
	for (i=0; i<array.length;i++) {
		var p = $("<p>");
		var label = $(`<label for=${array[i]}>`);
		var input = $(`<input id=${array[i]} value=${array[i]} name=${type} type='checkbox'>`);
		var span = $(`<span>${array[i]}</span>`);
		label.append(input, span);
		p.append(label);
		$(`#${type}-container`).append(p);
	}
}

//To do: Make this DRY
$("#saving-add").on("click", function(event) {
	event.preventDefault();
	var newCategory = $("#add-saving").val();
	var p = $("<p>");
	var label = $(`<label for=${newCategory}>`);
	var input = $(`<input id=${newCategory} value=${newCategory} name='savings' type='checkbox'>`);
	var span = $(`<span>${newCategory}</span>`);
	label.append(input, span);
	p.append(label);
	if (!newCategory) {
 	} else {
		$(`#saving-container`).append(p);
	}
});

$("#expense-add").on("click", function(event) {
	event.preventDefault();
	var newCategory = $("#add-expense").val();
	var p = $("<p>");
	var label = $(`<label for=${newCategory}>`);
	var input = $(`<input id=${newCategory} value=${newCategory} name='expense' type='checkbox'>`);
	var span = $(`<span>${newCategory}</span>`);
	label.append(input, span);
	p.append(label);
	if (!newCategory) {
 	} else {
		$(`#expense-container`).append(p);
	}
});




generateCategories(expenseCategories, "expense");
generateCategories(savingsCategories, "saving");







