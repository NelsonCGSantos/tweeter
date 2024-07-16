$(document).ready(function () {
  $(".new-tw textarea").on("input", function () {
    const charCount = $(this).val().length;
    const charLeft = 140 - charCount;
    $(this).siblings("div").find(".counter").text(charLeft);

    // Color change
    if (charLeft < 0) {
      $(this).siblings("div").find(".counter").addClass("over-limit");
    } else {
      $(this).siblings("div").find(".counter").removeClass("over-limit");
    }
  });
});
