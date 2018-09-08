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
        yourExpenses.push(checkboxes[i]);
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
        yourSavings.push(checkboxes[i]);
     	}
	 }
	 $("#saving-form").toggleClass("hide");
	 $("#budget-button").attr("onclick", "budget()");
	 budget();
	 console.log(yourSavings);
}
	
function budget() {
	event.preventDefault();

	for (i=0;i<yourExpenses.length;i++) {
		console.log("hi");
		var input = $(`<input type='range' id='${yourExpenses[i]}-category' min='0' max='5000' step='1' value='slider'>`);
		$("#expense-range-container").append(input);
	}
}
	

	//Updating progress bar
  $(".progress-bar li:first-child").addClass("complete");
  $(".progress-bar li:nth-child(2)").addClass("complete");
  $(".progress-bar li:nth-child(3)").addClass("complete");
  $(".progress-bar li:nth-child(4)").addClass("active");