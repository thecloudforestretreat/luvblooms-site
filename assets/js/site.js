(function () {
  function qs(sel) { return document.querySelector(sel); }

  function openMenu() {
    var panel = qs(".menu-panel");
    var overlay = qs("[data-menu-overlay]");
    var btn = qs(".hamburger");
    if (!panel || !overlay || !btn) return;

    overlay.hidden = false;
    panel.hidden = false;
    panel.setAttribute("data-open", "true");
    btn.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    var panel = qs(".menu-panel");
    var overlay = qs("[data-menu-overlay]");
    var btn = qs(".hamburger");
    if (!panel || !overlay || !btn) return;

    panel.setAttribute("data-open", "false");
    btn.setAttribute("aria-expanded", "false");

    setTimeout(function () {
      panel.hidden = true;
      overlay.hidden = true;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }, 200);
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest(".hamburger");
    var closeBtn = e.target.closest(".menu-close");
    var overlay = e.target.closest("[data-menu-overlay]");
    var navLink = e.target.closest(".menu-links a");

    if (openBtn) openMenu();
    if (closeBtn || overlay || navLink) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
})();
