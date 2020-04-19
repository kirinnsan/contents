$(function () {
  $("input[type='submit']").on("click", function() {
    let $submit = $(this);
    let $form = $submit.parents("form");
    $form.attr("method", $submit.data("method"));
    $form.attr("action", $submit.data("action"));
    $form.submit();
    $submit.off().prop("disable", true);
    $form.on("submit", false);
  });
});
