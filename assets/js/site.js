document.addEventListener("click", function (e) {
  const btn = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-mobile");
  if (!btn || !nav) return;

  if (e.target.closest(".hamburger")) {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
  }
});
