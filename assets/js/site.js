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

  function getPanel() {
    return document.getElementById("mobileMenu") || document.querySelector(".menu-panel");
  }

  function getOverlay() {
    return document.querySelector("[data-menu-overlay]") || document.querySelector(".menu-overlay");
  }

  function getButton() {
    return document.querySelector("[data-menu-open]") || document.querySelector(".hamburger");
  }

  function openMenu() {
    var panel = getPanel();
    var overlay = getOverlay();
    var button = getButton();

    if (!panel || !button) return;

    if (overlay) overlay.hidden = false;

    panel.hidden = false;
    panel.setAttribute("data-open", "true");
    button.setAttribute("aria-expanded", "true");

    document.documentElement.classList.add("menu-is-open");
    document.body.classList.add("menu-is-open");
  }

  function closeMenu() {
    var panel = getPanel();
    var overlay = getOverlay();
    var button = getButton();

    if (!panel || !button) return;

    panel.setAttribute("data-open", "false");
    button.setAttribute("aria-expanded", "false");

    document.documentElement.classList.remove("menu-is-open");
    document.body.classList.remove("menu-is-open");

    window.setTimeout(function () {
      if (panel.getAttribute("data-open") === "false") {
        panel.hidden = true;

        if (overlay) {
          overlay.hidden = true;
        }
      }
    }, 200);
  }

  function toggleMenu() {
    var panel = getPanel();

    if (panel && panel.getAttribute("data-open") === "true") {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function initMenu() {
    if (document.__lbMenuBound) return;

    document.__lbMenuBound = true;

    document.addEventListener("click", function (event) {
      var openButton = event.target.closest("[data-menu-open], .hamburger");
      var closeButton = event.target.closest("[data-menu-close], .menu-close");
      var overlay = event.target.closest("[data-menu-overlay], .menu-overlay");
      var navLink = event.target.closest(".menu-links a");

      if (openButton) {
        event.preventDefault();
        toggleMenu();
        return;
      }

      if (closeButton || overlay || navLink) {
        closeMenu();
      }
    }, true);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
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
      initMenu();
      initAutoCapitalize();
      initPhoneMask();
    });
  });
})();
