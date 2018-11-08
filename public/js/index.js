// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  displayPage();
  setupEventHandlers();
});

function displayPage() {
  // Send the GET request.
  API.getExamples().then(
    function(examples) {
      renderTemplate({
        msg: "Welcome!",
        examples: examples
      });
    }
  );
}

function renderTemplate(data) {
  var source = $("#page-template").text();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#app").html(html);
}


// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $("#example-text").val().trim(),
    description: $("#example-description").val().trim()
  };

  if (!example.text || !example.description) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    displayPage();
  });

  $("#example-text").val("");
  $("#example-description").val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this).attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    displayPage();
  });
};

function setupEventHandlers() {
  // Add event listeners to the submit and delete buttons
  $(document).on("click", "#submit", handleFormSubmit);
  $(document).on("click", "#example-list .delete", handleDeleteBtnClick);
}
