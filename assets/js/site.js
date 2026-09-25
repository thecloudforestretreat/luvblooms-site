(function () {
  "use strict";

  var SCROLL_DEPTHS = [25, 50, 75, 90];
  var scrollDepthSent = {};

  function trackEvent(eventName, params) {
    if (!eventName) return;

    params = params || {};

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params));

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }

  function initContactLinks() {
    if (window.LUVBLOOMS_CONTACTS) {
      window.LUVBLOOMS_CONTACTS.update(document);
    }
  }

  function initWhatsAppWidget() {
    if (!window.LUVBLOOMS_CONTACTS || document.querySelector(".lb-whatsapp-widget")) return;

    var isSpanish = document.documentElement.lang.toLowerCase().indexOf("es") === 0;
    var link = document.createElement("a");
    link.className = "lb-whatsapp-widget";
    link.href = window.LUVBLOOMS_CONTACTS.whatsappUrl(isSpanish ? "home_general_es" : "default");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", isSpanish ? "Escribir a LuvBlooms por WhatsApp" : "Chat with LuvBlooms on WhatsApp");
    link.setAttribute("data-analytics-event", "whatsapp_click");
    link.setAttribute("data-analytics-label", "Floating WhatsApp widget");
    link.setAttribute("data-analytics-location", "floating_widget");
    link.innerHTML = '<img src="/assets/images/icons/lb_wa.png" alt="" aria-hidden="true"><span>' + (isSpanish ? "Escríbenos" : "Chat with us") + "</span>";
    document.body.appendChild(link);
  }

  function normalizePath(pathname) {
    if (!pathname || pathname === "/") return "/";
    return pathname.replace(/\/+$/, "") + "/";
  }

  function localizeSharedChrome() {
    var isSpanish = document.documentElement.lang.toLowerCase().indexOf("es") === 0;
    var path = normalizePath(window.location.pathname);
    var counterparts = {
      "/": "/es/",
      "/es/": "/",
      "/services/": "/es/servicios/",
      "/es/servicios/": "/services/",
      "/services/brand-events-activations/": "/es/servicios/eventos-de-marca/",
      "/es/servicios/eventos-de-marca/": "/services/brand-events-activations/",
      "/services/intimate-events/": "/es/servicios/eventos-intimos/",
      "/es/servicios/eventos-intimos/": "/services/intimate-events/",
      "/services/custom-arrangements/": "/es/servicios/arreglos-florales/",
      "/es/servicios/arreglos-florales/": "/services/custom-arrangements/",
      "/services/floral-design-consultations/": "/es/servicios/consultoria-diseno-floral/",
      "/es/servicios/consultoria-diseno-floral/": "/services/floral-design-consultations/",
      "/curated-at-home/": "/es/experiencias-florales-en-casa/",
      "/es/experiencias-florales-en-casa/": "/curated-at-home/",
      "/about/": "/es/nosotros/",
      "/es/nosotros/": "/about/",
      "/inquire/": "/es/consultas/",
      "/es/consultas/": "/inquire/",
      "/privacy/": "/es/privacidad/",
      "/es/privacidad/": "/privacy/"
    };
    var labels = isSpanish
      ? { home: "Inicio", services: "Servicios", about: "Por qué LuvBlooms", inquire: "Consultas", privacy: "Privacidad" }
      : { home: "Home", services: "Services", about: "Why LuvBlooms", inquire: "Inquire", privacy: "Privacy" };
    var hrefs = isSpanish
      ? { home: "/es/", services: "/es/servicios/", about: "/es/nosotros/", inquire: "/es/consultas/", privacy: "/es/privacidad/" }
      : { home: "/", services: "/services/", about: "/about/", inquire: "/inquire/", privacy: "/privacy/" };

    document.querySelectorAll("[data-lb-nav-key]").forEach(function (link) {
      var key = link.getAttribute("data-lb-nav-key");
      if (labels[key]) link.textContent = labels[key];
      if (hrefs[key]) link.href = hrefs[key];
      if (hrefs[key] && normalizePath(hrefs[key]) === path) link.setAttribute("aria-current", "page");
    });

    document.querySelectorAll("[data-lb-home-link]").forEach(function (link) {
      link.href = hrefs.home;
      if (link.classList.contains("logo")) {
        link.setAttribute("aria-label", isSpanish ? "Inicio de LuvBlooms" : "LuvBlooms Home");
      }
    });

    document.querySelectorAll("[data-lb-language-switch]").forEach(function (link) {
      link.href = counterparts[path] || (isSpanish ? "/" : "/es/");
      link.textContent = isSpanish ? "English" : "Español";
      link.lang = isSpanish ? "en" : "es";
      link.hreflang = isSpanish ? "en" : "es";
    });

    document.querySelectorAll("[data-lb-primary-nav]").forEach(function (nav) {
      nav.setAttribute("aria-label", isSpanish ? "Navegación principal" : "Primary navigation");
    });
    document.querySelectorAll("[data-lb-mobile-primary-nav]").forEach(function (nav) {
      nav.setAttribute("aria-label", isSpanish ? "Navegación móvil" : "Mobile navigation");
    });
    document.querySelectorAll("[data-lb-footer-nav]").forEach(function (nav) {
      nav.setAttribute("aria-label", isSpanish ? "Navegación del pie de página" : "Footer navigation");
    });

    var serviceArea = document.querySelector("[data-lb-footer-service-area]");
    if (serviceArea) {
      serviceArea.textContent = isSpanish
        ? "Estudio de diseño floral en Doral, con servicio en todo el condado de Miami-Dade."
        : "Floral design studio based in Doral and serving Miami-Dade County.";
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

    document.addEventListener("luvblooms:form-success", function (event) {
      var detail = event.detail || {};
      var params = getPageContext();
      params.form_name = detail.form_name || "";
      params.lead_type = detail.lead_type || "floral_inquiry";
      trackEvent("form_submit_success", params);
      trackEvent("generate_lead", params);
    });

    document.addEventListener("luvblooms:form-error", function (event) {
      var detail = event.detail || {};
      var params = getPageContext();
      params.form_name = detail.form_name || "";
      params.error_message = detail.error_message || "";
      trackEvent("form_submit_error", params);
    });
  }

  window.LuvBloomsAnalytics = {
    trackEvent: trackEvent,
    getPageContext: getPageContext
  };

  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      include("siteHeader", "/assets/includes/header.html"),
      include("siteFooter", "/assets/includes/footer.html")
    ]).then(function () {
      localizeSharedChrome();
      initMobileNav();
      initAutoCapitalize();
      initPhoneMask();
      initContactLinks();
      initWhatsAppWidget();
      initAnalyticsEvents();
    });
  });
})();
