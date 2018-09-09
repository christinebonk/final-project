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

var yourExpenses = [];
var yourSavings = [];

function expense() {
	event.preventDefault();
	
	 var checkboxes = document.getElementsByName("expense");
	 for (i=0;i<checkboxes.length;i++) {
	 	if (checkboxes[i].checked) {
        yourExpenses.push(checkboxes[i].value);
     	}
	 }
	 $("#saving-form").toggleClass("hide");
	 $("#expense-form").toggleClass("hide");
	 console.log(yourExpenses);
	 $("#budget-button").attr("onclick", "saving()");
}

function saving() {
 	event.preventDefault();

	
	
	 var checkboxes = document.getElementsByName("saving");
	 for (i=0;i<checkboxes.length;i++) {
	 	if (checkboxes[i].checked) {

        yourSavings.push(checkboxes[i].value);
     	}
	 }
	 $("#budget-container").toggleClass("hide");
	 $("#budget-button").attr("onclick", "budget()");
	 budget();
}
	
function budget() {
	event.preventDefault();
	$("#remaining-budget").toggleClass("hide");

	for (i=0;i<yourExpenses.length;i++) {
		var container = $("<div class='input-container'>");
		var label = $(`<label for='${yourExpenses[i]}-category'>${yourExpenses[i]}</label>`)
		var input = $(`<input type='text' class='expense-input budget-input' id='${yourExpenses[i]}-category'>`);
		input.attr("onfocusout", "updateBars()");
		container.append(label, input);
		$("#expense-range-container").append(container);
	}
	for (i=0;i<yourSavings.length;i++) {
		var container = $("<div class='input-container'>");
		var label = $(`<label for '${yourSavings[i]}-category'>${yourSavings[i]}</label>`);
		var input = $(`<input type='text' class='savings-input budget-input' id='${yourSavings[i]}-category'>`);
		input.attr("onfocusout", "updateBars()");
		container.append(label, input);
		$("#saving-range-container").append(container);

	}
}

var totalIncome = 0;
$.ajax("/api/income", {
	type: "GET",
}).then(function(res) {
	for (i=0;i<res.length;i++) {
		if(res[i].period === "monthly") {
			totalIncome += res[i].amount;
		}
	}
	$("#budget-remaining").text(totalIncome);
});

function updateBars() {
	var totalSpent = 0;
	for (i=0;i<yourExpenses.length;i++) {
		var expenseValue = $(`#${yourExpenses[i]}-category`).val();
		if (!expenseValue) {
			expenseValue = 0;
		}
		var expenseValue = parseInt(expenseValue);
		totalSpent += expenseValue;
	}
	for (i=0;i<yourSavings.length;i++) {
		var savingValue = $(`#${yourSavings[i]}-category`).val();
		if (!savingValue) {
			savingValue = 0;
		}
		var savingValue = parseInt(savingValue);
		totalSpent += savingValue;
	}
	var totalRemaining = totalIncome - totalSpent;
	$("#budget-spent").text(totalSpent);
	$("#budget-remaining").text(totalRemaining);

	var spentPercentage = (totalSpent/totalIncome)*100;
	var remainingPercentage = (totalRemaining/totalIncome)*100;
	console.log(spentPercentage);
	console.log(remainingPercentage);

	if (totalRemaining < 0) {
		$("#budget-empty p").css("color", "red");
	}  else {
		$("#budget-empty p").css("color", "black");
	}

	$("#budget-full").css("width", `${spentPercentage}%`);
	$("#budget-empty").css("width", `${remainingPercentage}%`);
}
	


	

	//Updating progress bar
  $(".progress-bar li:first-child").addClass("complete");
  $(".progress-bar li:nth-child(2)").addClass("complete");
  $(".progress-bar li:nth-child(3)").addClass("complete");
  $(".progress-bar li:nth-child(4)").addClass("active");