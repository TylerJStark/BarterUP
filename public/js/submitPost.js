$(document).ready(function() {

    $("#postForm").on("submit", function handleFormSubmit(event) {
        event.preventDefault();
        console.log("submit clicked");
        
        $.get("/api/user_data", function(data) {
        var userId = data.id;

        var title = $("#titleInput").val().trim();
        var body = $("#bodyInput").val().trim();

        var fileInput = $("#the-file");
        var file = fileInput[0].files[0];
        console.log(file);
        var formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', body);
        formData.append('id', userId);

        

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/api/post', true);
        xhr.send(formData);
            
        })

        
        
    
    });




});