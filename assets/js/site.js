/* /assets/js/site.js
   LuvBlooms global site controller and analytics engine
   GA4 measurement ID: G-T3XJE3NV2Y

   Responsibilities:
   - Load shared header and footer includes
   - Load and initialize GA4 once
   - Expose window.gtag and window.lbAnalyticsTrack
   - Send a native page_view plus page_view_enhanced once per page load
   - Send scroll_depth at 25, 50, 75, and 90 percent
   - Listen globally for clicks on [data-analytics-event]
   - Infer analytics for ordinary internal, outbound, WhatsApp, email, and phone links
   - Track FAQ expansion and form engagement
   - Apply lightweight form enhancements such as name capitalization and phone masking
   - Preserve the current LuvBlooms mobile menu behavior
*/

(function () {
  "use strict";

  var GA_ID = "G-T3XJE3NV2Y";
  var SCROLL_MILESTONES = [25, 50, 75, 90];
  var sentScroll = {};
  var startedForms = {};
  var visibleFormStates = {};

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function loadIncludes() {
    var targets = [
      { id: "siteHeader", url: "/assets/includes/header.html" },
      { id: "siteFooter", url: "/assets/includes/footer.html" }
    ];

    targets.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (!el || el.getAttribute("data-include-loaded") === "true") return;

      fetch(item.url, { credentials: "same-origin" })
        .then(function (response) {
          if (!response.ok) throw new Error("Include failed: " + item.url);
          return response.text();
        })
        .then(function (html) {
          el.innerHTML = html;
          el.setAttribute("data-include-loaded", "true");
        })
        .catch(function () {
          el.setAttribute("data-include-loaded", "error");
        });
    });
  }

  function absUrl(value) {
    try { return new URL(value || window.location.href, window.location.origin).href; }
    catch (e) { return value || ""; }
  }

  function cleanText(value) {
    return (value || "").toString().replace(/\s+/g, " ").trim();
  }

  function safeDataset(el, key) {
    if (!el || !el.dataset) return "";
    return el.dataset[key] || "";
  }

  function getMeta(name) {
    var el = document.querySelector('meta[name="' + name + '"]') || document.querySelector('meta[property="' + name + '"]');
    return el ? (el.getAttribute("content") || "") : "";
  }

  function getCanonical() {
    var el = document.querySelector('link[rel="canonical"]');
    return el ? absUrl(el.getAttribute("href") || "") : window.location.href;
  }

  function getPageType() {
    if (!document.body) return "unknown";
    return (
      document.body.getAttribute("data-page-type") ||
      document.body.getAttribute("data-analytics-page-type") ||
      "unknown"
    );
  }

  function getPageCategory() {
    if (!document.body) return "";
    return (
      document.body.getAttribute("data-page-category") ||
      document.body.getAttribute("data-service") ||
      document.body.getAttribute("data-collection") ||
      ""
    );
  }

  function getPageLanguage() {
    var htmlLang = document.documentElement ? document.documentElement.getAttribute("lang") : "";
    if (!document.body) return htmlLang || "en";
    return (
      document.body.getAttribute("data-page-language") ||
      document.body.getAttribute("data-analytics-page-language") ||
      htmlLang ||
      "en"
    );
  }

  function getDeviceType() {
    var width = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
    if (width > 0 && width < 768) return "mobile";
    if (width >= 768 && width < 1024) return "tablet";
    return "desktop";
  }

  function getDebugMode() {
    var search = window.location.search || "";
    if (/[?&](debug_mode|lb_debug)=true(&|$)/i.test(search)) return true;
    try { return !!(window.localStorage && window.localStorage.getItem("debug_mode") === "true"); }
    catch (e) { return false; }
  }

  function getPageContext() {
    return {
      page_title: document.title || "",
      page_path: window.location.pathname || "/",
      page_url: window.location.href,
      page_location: window.location.href,
      canonical_url: getCanonical(),
      page_type: getPageType(),
      page_category: getPageCategory(),
      page_language: getPageLanguage(),
      device_type: getDeviceType()
    };
  }

  function basePayload(extra) {
    var payload = getPageContext();

    if (getDebugMode()) payload.debug_mode = true;

    if (extra) {
      Object.keys(extra).forEach(function (key) {
        if (extra[key] !== undefined && extra[key] !== null && extra[key] !== "") {
          payload[key] = extra[key];
        }
      });
    }

    return payload;
  }

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + GA_ID + '"]')) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
      (document.head || document.documentElement).appendChild(s);
    }

    if (!window.__lbGa4Configured) {
      window.__lbGa4Configured = true;
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        send_page_view: true,
        page_title: document.title || "",
        page_location: window.location.href,
        page_path: window.location.pathname || "/",
        debug_mode: getDebugMode() || undefined
      });
    }
  }

  function sendEvent(name, payload) {
    if (!name) return;
    ensureGtag();
    window.gtag("event", name, basePayload(payload || {}));
  }

  window.lbAnalyticsTrack = sendEvent;
  window.lbAnalyticsContext = getPageContext;

  window.lbAnalyticsFormSuccess = function (formName, extra) {
    var payload = extra || {};
    payload.form_name = formName || payload.form_name || "form";
    sendEvent("form_submit_success", payload);
  };

  window.lbAnalyticsFormError = function (formName, errorMessage, extra) {
    var payload = extra || {};
    payload.form_name = formName || payload.form_name || "form";
    payload.error_message = errorMessage || payload.error_message || "Form submission error";
    sendEvent("form_submit_error", payload);
  };

  function isSameHost(url) {
    try { return new URL(url, window.location.origin).hostname === window.location.hostname; }
    catch (e) { return false; }
  }

  function classifyLink(a) {
    var href = a.getAttribute("href") || "";
    var lower = href.toLowerCase();

    if (!href || href.charAt(0) === "#") return "anchor";
    if (lower.indexOf("wa.me/") !== -1 || lower.indexOf("api.whatsapp.com") !== -1 || lower.indexOf("whatsapp://") === 0) return "whatsapp";
    if (lower.indexOf("mailto:") === 0) return "email";
    if (lower.indexOf("tel:") === 0) return "phone";
    if (isSameHost(href)) return "internal";
    return "outbound";
  }

  function inferLinkEvent(a) {
    var linkType = classifyLink(a);
    if (linkType === "whatsapp") return "whatsapp_click";
    if (linkType === "email") return "email_click";
    if (linkType === "phone") return "phone_click";
    if (linkType === "internal" || linkType === "anchor") return "internal_link_click";
    if (linkType === "outbound") return "outbound_link_click";
    return "link_click";
  }

  function payloadFromElement(el) {
    var label = safeDataset(el, "analyticsLabel") ||
      cleanText(el.textContent) ||
      el.getAttribute("aria-label") ||
      el.getAttribute("title") ||
      "";

    var payload = {
      label: label,
      event_label: label,
      cta_label: safeDataset(el, "analyticsLabel") || label,
      cta_location: safeDataset(el, "analyticsLocation"),
      link_text: label,
      section_name: safeDataset(el, "analyticsSection"),
      page_type: safeDataset(el, "analyticsPageType") || getPageType(),
      page_category: safeDataset(el, "analyticsPageCategory") || getPageCategory(),
      page_language: safeDataset(el, "analyticsPageLanguage") || getPageLanguage(),
      collection_name: safeDataset(el, "analyticsCollection"),
      product_name: safeDataset(el, "analyticsProduct"),
      service_name: safeDataset(el, "analyticsService"),
      form_name: safeDataset(el, "analyticsForm"),
      location_name: safeDataset(el, "analyticsLocationName")
    };

    if (el.tagName && el.tagName.toLowerCase() === "a") {
      payload.link_url = absUrl(el.getAttribute("href") || "");
      payload.link_type = classifyLink(el);
    }

    return payload;
  }

  function trackAttributedClick(e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-analytics-event]") : null;
    if (!el) return false;
    sendEvent(el.getAttribute("data-analytics-event"), payloadFromElement(el));
    return true;
  }

  function trackUnattributedLink(e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    if (a.closest("[data-analytics-event]")) return;

    var eventName = inferLinkEvent(a);
    var payload = payloadFromElement(a);
    payload.event_label = cleanText(a.textContent) || a.getAttribute("aria-label") || a.getAttribute("title") || payload.link_url;
    payload.label = payload.event_label;
    payload.link_text = payload.event_label;
    sendEvent(eventName, payload);
  }

  function trackPageView() {
    if (window.__lbPageViewEnhancedSent) return;
    window.__lbPageViewEnhancedSent = true;
    sendEvent("page_view_enhanced", {
      meta_description: getMeta("description"),
      og_url: getMeta("og:url"),
      referrer: document.referrer || "",
      viewport_width: window.innerWidth || 0,
      viewport_height: window.innerHeight || 0
    });
  }

  function getScrollPercent() {
    var doc = document.documentElement;
    var body = document.body;
    var scrollTop = window.pageYOffset || doc.scrollTop || (body && body.scrollTop) || 0;
    var scrollHeight = Math.max(
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      doc.clientHeight,
      doc.scrollHeight,
      doc.offsetHeight
    );
    var winHeight = window.innerHeight || doc.clientHeight || 0;
    var trackLength = Math.max(scrollHeight - winHeight, 1);
    return Math.min(100, Math.round((scrollTop / trackLength) * 100));
  }

  function checkScrollDepth() {
    var pct = getScrollPercent();
    SCROLL_MILESTONES.forEach(function (m) {
      if (!sentScroll[m] && pct >= m) {
        sentScroll[m] = true;
        sendEvent("scroll_depth", { scroll_percent: m });
      }
    });
  }

  function initScrollTracking() {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        checkScrollDepth();
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    checkScrollDepth();
  }

  function initNativeDetailsFaqTracking() {
    document.addEventListener("toggle", function (e) {
      var details = e.target;
      if (!details || details.tagName !== "DETAILS" || !details.open) return;
      if (details.getAttribute("data-analytics-event")) return;
      var summary = details.querySelector("summary");
      var faqLabel = summary ? cleanText(summary.textContent) : "FAQ expanded";
      sendEvent("faq_expand", {
        label: faqLabel,
        event_label: faqLabel,
        section_name: "faq"
      });
    }, true);
  }

  function initCustomFaqClickTracking() {
    if (document.__lbCustomFaqBound) return;
    document.__lbCustomFaqBound = true;

    document.addEventListener("click", function (e) {
      var el = e.target && e.target.closest ? e.target.closest("[data-faq-question], .faq-question, .faq-toggle, .faq-card, .faq-item button, [aria-controls][aria-expanded]") : null;
      if (!el) return;
      if (el.closest("[data-analytics-event]")) return;
      if (el.tagName && el.tagName.toLowerCase() === "a") return;

      var expanded = el.getAttribute("aria-expanded");
      if (expanded === "false") return;

      var faqLabel = cleanText(el.textContent) || el.getAttribute("aria-label") || "FAQ expanded";
      sendEvent("faq_expand", {
        label: faqLabel,
        event_label: faqLabel,
        section_name: "faq"
      });
    }, true);
  }

  function getFormName(form) {
    return form.getAttribute("data-analytics-form") || form.getAttribute("name") || form.getAttribute("id") || "form";
  }

  function formPayload(form, extra) {
    var payload = extra || {};
    payload.form_name = getFormName(form);
    payload.section_name = safeDataset(form, "analyticsSection") || payload.section_name;
    return payload;
  }

  function initFormTracking() {
    document.addEventListener("focusin", function (e) {
      var field = e.target;
      if (!field || !field.closest) return;
      var form = field.closest("form");
      if (!form) return;
      var name = getFormName(form);
      if (startedForms[name]) return;
      startedForms[name] = true;
      sendEvent("form_start", formPayload(form));
    });

    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form || form.tagName !== "FORM") return;

      var explicit = form.getAttribute("data-analytics-event");
      if (explicit) {
        sendEvent(explicit, payloadFromElement(form));
        return;
      }
      sendEvent("form_submit_attempt", formPayload(form));
    }, true);

    document.addEventListener("luvblooms:form-success", function (e) {
      var detail = e.detail || {};
      window.lbAnalyticsFormSuccess(detail.form_name || detail.formName || "form", detail);
    });

    document.addEventListener("luvblooms:form-error", function (e) {
      var detail = e.detail || {};
      window.lbAnalyticsFormError(detail.form_name || detail.formName || "form", detail.error_message || detail.errorMessage || "Form submission error", detail);
    });
  }

  function elementIsVisible(el) {
    if (!el) return false;
    var style = window.getComputedStyle ? window.getComputedStyle(el) : null;
    if (style && (style.display === "none" || style.visibility === "hidden" || style.opacity === "0")) return false;
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function detectVisibleFormStates() {
    var successSelectors = [
      "[data-form-success]",
      ".form-success",
      ".success-message",
      ".contact-success",
      "[role='status']"
    ];

    var errorSelectors = [
      "[data-form-error]",
      ".form-error",
      ".error-message",
      ".contact-error",
      "[role='alert']"
    ];

    successSelectors.forEach(function (sel) {
      Array.prototype.slice.call(document.querySelectorAll(sel)).forEach(function (el) {
        if (!elementIsVisible(el)) return;
        var formName = el.getAttribute("data-analytics-form") || el.getAttribute("data-form-success") || "form";
        var key = "success:" + formName + ":" + cleanText(el.textContent);
        if (visibleFormStates[key]) return;
        visibleFormStates[key] = true;
        var successLabel = cleanText(el.textContent) || "Form success";
        sendEvent("form_submit_success", {
          label: successLabel,
          form_name: formName,
          event_label: successLabel
        });
      });
    });

    errorSelectors.forEach(function (sel) {
      Array.prototype.slice.call(document.querySelectorAll(sel)).forEach(function (el) {
        if (!elementIsVisible(el)) return;
        var formName = el.getAttribute("data-analytics-form") || el.getAttribute("data-form-error") || "form";
        var msg = cleanText(el.textContent) || "Form submission error";
        var key = "error:" + formName + ":" + msg;
        if (visibleFormStates[key]) return;
        visibleFormStates[key] = true;
        sendEvent("form_submit_error", {
          label: msg,
          form_name: formName,
          error_message: msg,
          event_label: msg
        });
      });
    });
  }

  function initVisibleFormStateObserver() {
    detectVisibleFormStates();
    if (!window.MutationObserver || window.__lbFormStateObserver) return;
    window.__lbFormStateObserver = new MutationObserver(function () {
      detectVisibleFormStates();
    });
    window.__lbFormStateObserver.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "aria-hidden"]
    });
  }

  function initAnalytics() {
    ensureGtag();
    trackPageView();
    initScrollTracking();
    initNativeDetailsFaqTracking();
    initCustomFaqClickTracking();
    initFormTracking();
    initVisibleFormStateObserver();

    if (!document.__lbAnalyticsClickBound) {
      document.__lbAnalyticsClickBound = true;
      document.addEventListener("click", function (e) {
        if (trackAttributedClick(e)) return;
        trackUnattributedLink(e);
      }, true);
    }
  }

  function initMenu() {
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

    if (!document.__lbMenuClickBound) {
      document.__lbMenuClickBound = true;
      document.addEventListener("click", function (e) {
        var openBtn = e.target.closest(".hamburger");
        var closeBtn = e.target.closest(".menu-close");
        var overlay = e.target.closest("[data-menu-overlay]");
        var navLink = e.target.closest(".menu-links a");

        if (openBtn) openMenu();
        if (closeBtn || overlay || navLink) closeMenu();
      });
    }

    if (!document.__lbMenuKeyBound) {
      document.__lbMenuKeyBound = true;
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });
    }
  }

  function toTitleCase(value) {
    return (value || "")
      .toLowerCase()
      .replace(/(^|[\s'-])([a-z])/g, function (match, prefix, letter) {
        return prefix + letter.toUpperCase();
      });
  }

  function formatUsPhone(value) {
    var digits = (value || "").replace(/\D/g, "").slice(0, 10);
    var a = digits.slice(0, 3);
    var b = digits.slice(3, 6);
    var c = digits.slice(6, 10);

    if (digits.length <= 3) return a;
    if (digits.length <= 6) return "(" + a + ") " + b;
    return "(" + a + ") " + b + "-" + c;
  }

  function initFormEnhancements() {
    if (!document.__lbFormEnhancementsBound) {
      document.__lbFormEnhancementsBound = true;

      document.addEventListener("input", function (e) {
        var target = e.target;
        if (!target || !target.matches) return;

        if (target.matches("[data-auto-capitalize='words']")) {
          var start = target.selectionStart;
          var nextValue = toTitleCase(target.value);
          if (nextValue !== target.value) {
            target.value = nextValue;
            if (typeof start === "number" && target.setSelectionRange) {
              target.setSelectionRange(start, start);
            }
          }
        }

        if (target.matches("[data-mask='phone-us']")) {
          target.value = formatUsPhone(target.value);
        }
      });

      document.addEventListener("blur", function (e) {
        var target = e.target;
        if (!target || !target.matches) return;

        if (target.matches("[data-auto-capitalize='words']")) {
          target.value = toTitleCase(target.value);
        }

        if (target.matches("[data-mask='phone-us']")) {
          target.value = formatUsPhone(target.value);
        }
      }, true);
    }
  }

  function boot() {
    loadIncludes();
    initAnalytics();
    initMenu();
    initFormEnhancements();
  }

  ready(boot);
})();
