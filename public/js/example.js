// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  displayPage();
});

function displayPage() {
  let exampleNumber = location.hash.substr(1);
  // Send the GET request.
  API.getExample(exampleNumber).then(
    function(example) {
      renderTemplate(example);
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
  getExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "GET"
    });
  }
};
