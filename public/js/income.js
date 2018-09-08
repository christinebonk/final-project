//Updating progress bar
$(".progress-bar li:first-child").addClass("complete");
$(".progress-bar li:nth-child(2)").addClass("complete");
$(".progress-bar li:nth-child(3)").addClass("active");

$(".income-button").on("click", function(event) {
	var period = $(this).attr("id");
	$(".modal-income-save").attr("data-category", period);

})

$(".modal-income-save").on("click", function(event) {
	event.preventDefault();
	var name = $("#income-name").val().trim();
	var amount = $("#income-amount").val().trim();
	var time = $("#income-time").val().trim();
	var period = $(this).attr("data-category");

	$.ajax("/income", {
		type: "PUT",
		data: {
			name: name,
			amount: amount,
			time: time,
			type: "income",
			period: period
		}
	}).then(function(res) {
		console.log(res);
	});
});