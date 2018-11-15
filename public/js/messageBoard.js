$(document).ready(function() {
   // Gets an optional query string from our url (i.e. ?post_id=23)
   var url = window.location.search;
   var postId;
   // Sets a flag for whether or not we're updating a post to be false initially
   var updating = false;
 
   // If we have this section in our url, we pull out the post id from the url
   // In localhost:8080/cms?post_id=1, postId is 1
   if (url.indexOf("?post_id=") !== -1) {
     postId = url.split("=")[1];
     getPostData(postId);
   }
 
   // Getting jQuery references to the post body, title, form, and category select
   var bodyInput = $("#body");
   var cmsForm = $("#cms");
   $(cmsForm).on(".submit", function handleFormSubmit(event) {
     event.preventDefault();
     // Wont submit the post if we are missing a body
     if (!bodyInput.val().trim()) {
       return;
     }
     // Constructing a newPost object to hand to the database
     var newPost = {
       body: bodyInput.val().trim()
     };
 
     console.log(newPost);
 
     // If we're updating a post run updatePost to update a post
     // Otherwise run submitPost to create a whole new post
     if (updating) {
       newPost.id = postId;
       updatePost(newPost);
     }
     else {
       submitPost(newPost);
     }
   });
 
   // Submits a new post and brings user to post page upon completion
   function submitPost(Post) {
     $.post("/api/posts/", Post, function() {
       window.location.href = "/";
     });
   }
 
   // Gets post data for a post if we're editing
   function getPostData(id) {
     $.get("/api/posts/" + id, function(data) {
       if (data) {
         // If this post exists, prefill our cms forms with its data
         bodyInput.val(data.body);
         // If we have a post with this id, set a flag for us to know to update the post
         // when we hit submit
         updating = true;
       }
     });
   }

  /* global moment */
  // blogContainer holds all of our posts
  var postsContainer = $(".posts-container");

  // This function grabs posts from the database and updates the view
  function getPosts(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/posts", function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // Getting the initial list of posts
  getPosts();
  // InitializeRows handles appending all of our constructed post HTML inside
  // postsContainer
  function initializeRows() {
    postsContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
    }
    postsContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var newPostDate = $("<small>");
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    newPostBody.text(post.body);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newPostDate.text(formattedDate);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }


    // This function displays a message when there are no posts
  function displayEmpty() {
    postsContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No posts yet for this category, navigate <a href='/cms'>here</a> in order to create a new post.");
    postsContainer.append(messageH2);
  }
})
