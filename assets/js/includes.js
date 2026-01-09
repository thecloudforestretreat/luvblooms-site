document.addEventListener("DOMContentLoaded", function () {
  fetch("/assets/includes/header.html")
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var mount = document.getElementById("siteHeader");
      if (mount) mount.innerHTML = html;
    });

  fetch("/assets/includes/footer.html")
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var mount = document.getElementById("siteFooter");
      if (mount) mount.innerHTML = html;
    });
});
