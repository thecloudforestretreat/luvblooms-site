(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-T3XJE3NV2Y";
  var SCROLL_DEPTHS = [25, 50, 75, 90];
  var scrollDepthSent = {};

  function loadAnalytics() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());

    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: true,
      page_path: window.location.pathname,
      page_title: document.title
    });

    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID + '"]')) {
      var script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
      document.head.appendChild(script);
    }
  }

  function trackEvent(eventName, params) {
    if (!eventName) return;

    params = params || {};

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }

  function getPageContext() {
    return {
      page_path: window.location.pathname,
      page_title: document.title,
      page_type: document.body ? (document.body.getAttribute("data-page-type") || "") : "",
      primary_goal: document.body ? (document.body.getAttribute("data-primary-goal") || "") : ""
    };
  }

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

      trackEvent("mobile_menu_open", getPageContext());
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

  function initAnalyticsEvents() {
    trackEvent("page_view_enhanced", getPageContext());

    document.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      var button = event.target.closest("button");

      var el = link || button;
      if (!el) return;

      var explicitEvent = el.getAttribute("data-analytics-event");
      var href = link ? (link.getAttribute("href") || "") : "";

      var params = getPageContext();
      params.link_url = href;
      params.link_text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
      params.analytics_label = el.getAttribute("data-analytics-label") || "";
      params.analytics_location = el.getAttribute("data-analytics-location") || "";
      params.analytics_section = el.getAttribute("data-analytics-section") || "";

      if (explicitEvent) {
        trackEvent(explicitEvent, params);
        return;
      }

      if (!href) return;

      if (href.indexOf("mailto:") === 0) {
        trackEvent("email_click", params);
      } else if (href.indexOf("tel:") === 0) {
        trackEvent("phone_click", params);
      } else if (href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1) {
        trackEvent("whatsapp_click", params);
      } else if (/^https?:\/\//i.test(href) && href.indexOf(window.location.hostname) === -1) {
        trackEvent("outbound_link_click", params);
      } else {
        trackEvent("internal_link_click", params);
      }
    });

    document.addEventListener("focusin", function (event) {
      var form = event.target.closest("form[data-analytics-form]");
      if (!form || form.dataset.analyticsStarted === "true") return;

      form.dataset.analyticsStarted = "true";

      var params = getPageContext();
      params.form_name = form.getAttribute("data-analytics-form") || "";
      params.analytics_section = form.getAttribute("data-analytics-section") || "";

      trackEvent("form_start", params);
    });

    document.addEventListener("submit", function (event) {
      var form = event.target.closest("form[data-analytics-form]");
      if (!form) return;

      var params = getPageContext();
      params.form_name = form.getAttribute("data-analytics-form") || "";
      params.analytics_section = form.getAttribute("data-analytics-section") || "";

      trackEvent("form_submit_attempt", params);
    }, true);

    window.addEventListener("scroll", function () {
      var doc = document.documentElement;
      var body = document.body;

      var scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      var scrollHeight = Math.max(
        body.scrollHeight,
        doc.scrollHeight,
        body.offsetHeight,
        doc.offsetHeight,
        body.clientHeight,
        doc.clientHeight
      );

      var viewport = window.innerHeight || doc.clientHeight;
      var percent = Math.round((scrollTop + viewport) / scrollHeight * 100);

      SCROLL_DEPTHS.forEach(function (depth) {
        if (percent >= depth && !scrollDepthSent[depth]) {
          scrollDepthSent[depth] = true;

          var params = getPageContext();
          params.scroll_depth = depth;

          trackEvent("scroll_depth", params);
        }
      });
    }, { passive: true });
  }

  window.LuvBloomsAnalytics = {
    trackEvent: trackEvent,
    getPageContext: getPageContext
  };

  loadAnalytics();

  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      include("siteHeader", "/assets/includes/header.html"),
      include("siteFooter", "/assets/includes/footer.html")
    ]).then(function () {
      initMobileNav();
      initAutoCapitalize();
      initPhoneMask();
      initAnalyticsEvents();
    });
  });
})();
