$(document).ready(function() {

    $("#uploadForm").on("submit", function handleFormSubmit(event) {
        event.preventDefault();
        console.log("submit clicked");

        var fileInput = $("#the-file");
        var file = fileInput[0].files[0];
        console.log(file);
        var formData = new FormData();
        formData.append('file', file);

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/api/post', true);
        xhr.send(formData);
        
    
    });




});