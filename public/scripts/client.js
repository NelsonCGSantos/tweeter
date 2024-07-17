$(document).ready(function () {
  const createTweetElement = function(tweet) {
    const $tweet = $(`
        <article class="tweet">
          <header>
            <div class="tweet-user">
              <img src="${tweet.user.avatars}" alt="User avatar">
              <span>${tweet.user.name}</span>
            </div>
            <span class="tweet-handle">${tweet.user.handle}</span>
          </header>
          <div class="tweet-content">
            <p>${tweet.content.text}</p>
          </div>
          <footer>
            <span>${timeago.format(tweet.created_at)}</span>
            <div class="tweet-icons">
              <i class="fas fa-flag"></i>
              <i class="fas fa-retweet"></i>
              <i class="fas fa-heart"></i>
            </div>
          </footer>
        </article>
      `);
    return $tweet;
  };

  
  const renderTweets = function(tweets) {
    $("#tweets-container").empty(); // Clear the tweets container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $("#tweets-container").append($tweet);
    }
  };

  
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET",
      success: function(tweets) {
        renderTweets(tweets);
      },
      error: function(error) {
        console.error("Error loading tweets:", error);
      },
    });
  };

 
  loadTweets();

  // Event listener for tweet form submission
  const $form = $(".new-tweet form");
  $form.on("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Serialize
    const formData = $(this).serialize();

    //Serialized data via AJAX
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: formData,
      success: function(response) {
        console.log("Tweet submitted successfully:", response);
        loadTweets();
      },
      error: function(error) {
        console.error("Error submitting tweet:", error);
      },
    });
  });
});
