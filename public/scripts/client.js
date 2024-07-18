$(document).ready(function () {
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = function (tweet) {
    const $tweet = $(`
        <article class="tweet">
          <header>
            <div class="tweet-user">
              <img src="${escape(tweet.user.avatars)}" alt="User avatar">
              <span>${escape(tweet.user.name)}</span>
            </div>
            <span class="tweet-handle">${escape(tweet.user.handle)}</span>
          </header>
          <div class="tweet-content">
            <p>${escape(tweet.content.text)}</p>
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

  const renderTweets = function (tweets) {
    $("#tweets-container").empty(); // Clear the tweets container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $("#tweets-container").prepend($tweet);
    }
  };

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

  const $form = $(".new-tweet form");
  $form.on("submit", function (event) {
    event.preventDefault();
    const $tweetText = $(this).find("#tweet-text");
    const tweetContent = $tweetText.val().trim();
    const $errorMessage = $(this).find(".error-message");

    $errorMessage.slideUp(); // Hide error message before validation

    if (!tweetContent) {
      $errorMessage.text("Tweet content cannot be empty.");
      $errorMessage.slideDown();
      return;
    }

    if (tweetContent.length > 140) {
      $errorMessage.text(
        "Tweet content exceeds the maximum length of 140 characters."
      );
      $errorMessage.slideDown();
      return;
    }

    const formData = $(this).serialize();

    $.ajax({
      url: "/tweets",
      method: "POST",
      data: formData,
      success: function (response) {
        console.log("Tweet submitted successfully:", response);
        loadTweets(); // Refetch tweets from the server
        $form[0].reset(); // Reset the form after submission
        $(".counter").text(140); // Reset the counter
      },
      error: function(error) {
        console.error("Error submitting tweet:", error);
        $errorMessage.text("Error submitting tweet. Please try again.");
        $errorMessage.slideDown();
      },
    });
  });
});
