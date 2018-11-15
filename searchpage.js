$(document).ready(function() {

  // listingContainer holds all of our posts
  var listingContainer = $(".listing-container");
  // Variable to hold our posts
  var listings;

  // This function grabs posts from the database and updates the view
  function getPosts() {
    $.get("/api/listings", function(data) {
      console.log("listings", data);
      listings = data;
      initializeRows();
    });
  }

  // InitializeRows handles appending all of our constructed post HTML inside listingContainer
  function initializeRows() {
    listingContainer.empty();
    var listingsToAdd = [];
    for (var i = 0; i < listings.length; i++) {
      lisstingsToAdd.push(createNewRow(listings[i]));
    }
    listingContainer.append(listingsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var newPostTitle = $("<h2>");
    var newPostUser = $("<h5>");
    newPostUser.text("Written by: " + post.User.name);
    newPostUser.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(newPostUser);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }

});

//reference authors.js