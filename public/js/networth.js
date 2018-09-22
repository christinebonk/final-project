//Updating progress bar
  $(".progress-bar li:first-child").addClass("complete");
  $(".progress-bar li:nth-child(2)").addClass("active");
  
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
		location.reload();
		//TO DO: need to close modal 
	})
});

$.ajax("/account", {
	type: "GET"
}).then(function(res) {
	var totalBalanceAmount = 0;
	res.forEach(function(element) {
		totalBalanceAmount += element.balance;
		var balanceAmount = JSON.stringify(element.balance);
		balanceAmount = balanceAmount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var row = $("<tr>");
		var account = $(`<td>${element.account}</td>`);
		var balance = $(`<td>${balanceAmount}</td>`);
		var type = $(`<td>${element.type}</td>`);
		row.append(account, balance, type);
		$("#networth-body").append(row);
	});
	var totalRow = $(`<tr class="total-row">`);
	var totalAccount = $(`<td class="total">Total</td>`);
	totalBalanceAmount = JSON.stringify(totalBalanceAmount);
	totalBalanceAmount = totalBalanceAmount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var totalBalance = $(`<td class="total">${totalBalanceAmount}</td>`);
	var totalType = $(`<td></td>`);
	totalRow.append(totalAccount, totalBalance, totalType);
	$("#networth-body").append(totalRow);
});