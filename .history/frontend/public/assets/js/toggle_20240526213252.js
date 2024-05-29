(function ($) {
  "use strict";
  $(function () {
    $("#sidebarToggle").on("click", function () {
      $(".sidebar-offcanvas").toggleClass("active");
    });
  });
})(jQuery);
