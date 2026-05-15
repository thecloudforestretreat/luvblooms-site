(function () {
  "use strict";

  function include(id, path) {
    var mount = document.getElementById(id);

    if (!mount) {
      return Promise.resolve();
    }

    return fetch(path, { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Could not load " + path);
        }

        return response.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
      })
      .catch(function () {
        return null;
      });
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-lb-nav-toggle]");
    var mobile = document.querySelector("[data-lb-mobile-nav]");

    if (!toggle || !mobile || toggle.dataset.lbNavBound === "true") {
      return;
    }

    toggle.dataset.lbNavBound = "true";

    function closeMenu() {
      mobile.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.documentElement.classList.remove("lb-menu-open");
    }

    function openMenu() {
      mobile.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.documentElement.classList.add("lb-menu-open");
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", function (event) {
      if (mobile.hidden) return;

      var closeHit = event.target.closest("[data-lb-nav-close]");
      var insideHeader = event.target.closest("[data-lb-header]");

      if (closeHit || !insideHeader) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 901) {
        closeMenu();
      }
    });

    closeMenu();
  }

  function initAutoCapitalize() {
    var fields = document.querySelectorAll('[data-auto-capitalize="words"]');

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        var start = field.selectionStart;
        var end = field.selectionEnd;

        field.value = field.value
          .toLowerCase()
          .replace(/\b([a-z])/g, function (match) {
            return match.toUpperCase();
          })
          .replace(/\s+/g, " ")
          .trimStart();

        try {
          field.setSelectionRange(start, end);
        } catch (error) {}
      });
    });
  }

  function initPhoneMask() {
    var phone = document.getElementById("phone");

    if (!phone) return;

    phone.addEventListener("input", function () {
      var digits = phone.value.replace(/\D/g, "").slice(0, 10);

      if (digits.length <= 3) {
        phone.value = digits ? "(" + digits : "";
      } else if (digits.length <= 6) {
        phone.value = "(" + digits.slice(0, 3) + ") " + digits.slice(3);
      } else {
        phone.value = "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      include("siteHeader", "/assets/includes/header.html"),
      include("siteFooter", "/assets/includes/footer.html")
    ]).then(function () {
      initMobileNav();
      initAutoCapitalize();
      initPhoneMask();
    });
  });
})();
