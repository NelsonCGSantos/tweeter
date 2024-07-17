/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  const createTweetElement = function (tweet) {
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

  // Render tweets
  const renderTweets = function (tweets) {
    $("#tweets-container").empty(); // Clear the tweets container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $("#tweets-container").prepend($tweet);
    }
  };

  // Load tweets from the server
  const loadTweets = function () {
    $.ajax({
      url: "/tweets",
      method: "GET",
      success: function (tweets) {
        renderTweets(tweets);
      },
      error: function (error) {
        console.error("Error loading tweets:", error);
      },
    });
  };

  loadTweets();

  // Event listener for form submission
  const $form = $(".new-tweet form");
  $form.on("submit", function (event) {
    event.preventDefault();

    const $tweetText = $(this).find("tweet-text");
    const tweetContent = $tweetText.val().trim();

    if (!tweetContent) {
      alert("Tweet content cannot be empty.");
      return;
    }

    if (tweetContent.length > 140) {
      alert("Tweet content exceeds the maximum length of 140 characters.");
      return;
    }

    const formData = $(this).serialize();

    $.ajax({
      url: "/tweets",
      method: "POST",
      data: formData,
      success: function(response) {
        console.log("Tweet submitted successfully:", response);
        const $newTweet = createTweetElement(response);
        $("#tweets-container").prepend($newTweet); // Prepend the new tweet
        $form[0].reset(); // Reset the form after submission
        $(".counter").text(140); // Reset the counter
      },
      error: function(error) {
        console.error("Error submitting tweet:", error);
      },
    });
  });
});