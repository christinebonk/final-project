//Updating progress bar
  $(".progress-bar li:first-child").addClass("complete");
  $(".progress-bar li:nth-child(2)").addClass("complete");
  $(".progress-bar li:nth-child(3)").addClass("complete");
  $(".progress-bar li:nth-child(4)").addClass("complete");
  $(".progress-bar li:nth-child(5)").addClass("active");

function getTotalNeeded() {
	$.ajax("/profile", {
		type: "GET"
	}).then(function(res) {
		totalNeeded = 0;
		var retirementCost = res[0].retirement_cost;
		var withdrawal = res[0].retirement_withdrawal;
		totalNeeded = retirementCost/withdrawal;
		console.log(totalNeeded);
	});
}

function getCurrentAmount() {
	$.ajax("/account", {
		type: "GET"
	}).then(function(res) {
		console.log(res);
		var currentAmount = 0;
		for (i=0;i<res.length;i++) {
			if(res[i].include) {
				currentAmount += res[i].balance;
			}
		}
		console.log(currentAmount);
	})
}

function getContribution() {
	$.ajax("/account", {
		type: "GET"
	}).then(function(res) {
		var contribution = res[0].retirement_contribution;
	})
}

function getGrowth() {
	$.ajax("/account", {
		type: "GET"
	}).then(function(res) {
		var growth = res[0].yearly_growth;
	})
}


function getProjectedTime(total, current, contribution, growth) {
	var i = current; 
	var time = 0;
	while (i < total ){
		i = i + contribution + i * growth;
		time ++;
		console.log(i);
	}
	console.log(i);
	console.log(time);
}

getProjectedTime(100000,99999,1000,0.06);

// getTotalNeeded();
// getCurrentAmount();