document.addEventListener("DOMContentLoaded", function () {
  fetch("/assets/includes/header.html")
    .then(r => r.text())
    .then(h => document.getElementById("siteHeader").innerHTML = h);

  fetch("/assets/includes/footer.html")
    .then(r => r.text())
    .then(f => document.getElementById("siteFooter").innerHTML = f);
});
