$(document).ready(function() {
	var email = $("#email");
	var password = $("#password");
	var firstName = $("#firstName");
	var lastName = $("#lastName");
	var password = $("#password");
	var userForm = $("#signup");

	$(userForm).on("submit", handleFormSubmit);

	function submitUser(post) {
    $.post("/api/users", post, function() {
      window.location.href = "/signuppage";
    });
  }

});