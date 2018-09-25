//Updating progress bar
  $(".progress-bar li:first-child").addClass("complete");
  $(".progress-bar li:nth-child(2)").addClass("complete");
  $(".progress-bar li:nth-child(3)").addClass("complete");
  $(".progress-bar li:nth-child(4)").addClass("complete");
  $(".progress-bar li:nth-child(5)").addClass("active");

//total needed for retirement
function getTotalNeeded() {
	$.ajax("/profile", {
		type: "GET"
	}).then(function(res) {
		totalNeeded = 0;
		var retirementCost = res[0].retirement_cost;
		var withdrawal = res[0].retirement_withdrawal;
		totalNeeded = retirementCost/withdrawal;
		getCurrentAmount(totalNeeded);
		totalNeeded = JSON.stringify(totalNeeded);
		totalNeeded = totalNeeded.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		$("#retirement-amount").text("$" + totalNeeded);
	});
}

function getCurrentAmount(t) {
	$.ajax("/account", {
		type: "GET"
	}).then(function(res) {
		var totalNeeded = t;
		var currentAmount = 0;
		for (i=0;i<res.length;i++) {
			if(res[i].include) {
				currentAmount += res[i].balance;
			}
		}
		getContribution(totalNeeded, currentAmount);
		var progress = currentAmount/totalNeeded*100;
		$("#retirement-goal").text(progress + "%");
	})
}

function getContribution(t, c) {
	$.ajax("/profile", {
		type: "GET"
	}).then(function(res) {
		var totalNeeded = t;
		var currentAmount = c;
		var contribution = res[0].retirement_contribution;
		var growth = res[0].yearly_growth;
		getProjectedTime(totalNeeded, currentAmount, contribution, growth)
	})
}


function getProjectedTime(total, current, contribution, growth) {
	console.log(total);
	console.log(current);
	console.log(contribution);
	console.log(growth);
	var i = current; 
	var time = 0;
	while (i < total ){
		i = i + contribution + i * growth;
		time ++;
	}

	var currentYear = (new Date()).getFullYear();
	var retirementYear = currentYear + time;
	$("#retirement-year").text(retirementYear);
}

getTotalNeeded();