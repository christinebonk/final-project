//goals
$(".goals-submit").on("click", function(event) {
	event.preventDefault();
	var date = $("#date").val().trim();
	var amount = $("#retirement-amount").val().trim();
	var error = false;

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


//range slider
$("#retirement-amount").change(function() {
	var amount = $(this).val();
	amount = amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	$(".rangeValue").text(amount);
});

$("#date").change(function() {
	var amount = $(this).val();
	$(".dateRangeValue").text(amount);
});

//Updating progress bar
  $(".progress-bar li:first-child").addClass("active");