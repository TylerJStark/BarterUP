$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $(".signup");
  var emailInput = $("#emailInput");
  var passwordInput = $("#passwordInput");
  var firstnameInput = $("#firstnameInput");
  var lastnameInput = $("#lastnameInput");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    console.log("inside the sign up form submit")
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      firstname: firstnameInput.val().trim(),
      lastname: lastnameInput.val().trim()
    };  
    console.log(userData);

    if (!userData.email || !userData.password) {
      console.log("inside the if");
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.firstname, userData.lastname);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, firstname, lastname) {
    console.log("inside signUpUser function");
    $.post("/api/signup", {
      email: email,
      password: password,
      firstName: firstname,
      lastName: lastname
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});