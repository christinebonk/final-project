$(".sign-up-submit").on("click", function(event) {
	event.preventDefault();
	var username =  $("#username").val().trim();
	var password = $("#password").val().trim();
	var email = $("#email").val().trim();


	//validations
	if (!username) {
		$("#username-error").text("Please enter a username");
		return
	}
	if (username.length > 15) {
		$("#username-error").text("Your user name cannot be greater than 15 characters");
		return
	}
	if (!password) {
		$("#password-error").text("Please enter a password");
		return
	}
	if (password.length < 8 || password.length > 60) {
		$("#password-error").text("Your password must be between 8 and 60 characters");
		return
	}

	//create object
	var newUser = {
		username: username,
		password: password,
		email: email
	};

	//post request
	$.ajax("/signup", {
		type: "POST",
		data: newUser
	}).then(function() {
		console.log("Created new user");
	})
})

