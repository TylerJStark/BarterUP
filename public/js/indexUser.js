// Make sure we wait to attach our handlers until the DOM is fully loaded.
// import dotenv from 'dotenv'
// dotenv.config()


$(function() {
    renderPage();
});

function renderPage() {
    var url = window.location.pathname
    var startAt= url.lastIndexOf("/")
    var name =  url.substring(startAt+1)
    
    // Send the GET request.
    $.get("/api/userProfile/"+ name).then(
        function(userProfile) {
            renderTemplate({ics: userProfile});
        }
    );
}

function renderTemplate(data) {
    var source = $("#page-template").text();
    var template = Handlebars.compile(source);
    var html = template(data);
    $("#app").html(html);
}