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
	
	if (include === "yes") {
		include = true;
	} else {
		include = false;
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

	})
})