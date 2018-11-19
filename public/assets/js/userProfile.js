// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
    renderPage();
    setupEventHandlers();
});

function renderPage() {
    // Get the part of the URL that follows the # symbol
    let userName = location.hash.substr(1);
    // Send the GET request.
    $.get("/api/userProfile/" + userName).then(
        function(icecream) {
            renderTemplate(icecream);
        }
    );
}

function renderTemplate(data) {
    var source = $("#page-template").text();
    var template = Handlebars.compile(source);
    var html = template(data);
    $("#app").html(html);
}

function setupEventHandlers() {
    // Register an event handler that gets called whenever the hash part of the URL changes
    $(window).on("hashchange", renderPage);
}
