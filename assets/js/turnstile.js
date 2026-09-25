(function () {
  "use strict";

  var config = window.LUVBLOOMS_CONFIG || {};

  function event(name, widget) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      turnstile_action: widget.getAttribute("data-action") || "form_submit",
      page_path: window.location.pathname
    });
  }

  function setToken(widget, token) {
    var form = widget.closest("form");
    var field = form ? form.querySelector('[name="turnstile_token"]') : null;
    if (field) field.value = token || "";
  }

  function renderWidget(widget) {
    if (!window.turnstile || widget.dataset.rendered === "true") return;

    var widgetId = window.turnstile.render(widget, {
      sitekey: config.turnstileSiteKey,
      action: widget.getAttribute("data-action") || "form_submit",
      theme: "auto",
      callback: function (token) {
        setToken(widget, token);
        event("turnstile_success", widget);
      },
      "expired-callback": function () {
        setToken(widget, "");
        event("turnstile_expired", widget);
      },
      "error-callback": function () {
        setToken(widget, "");
        event("turnstile_error", widget);
      }
    });

    widget.dataset.rendered = "true";
    widget.dataset.widgetId = String(widgetId);
  }

  function renderAll() {
    document.querySelectorAll("[data-turnstile-widget]").forEach(renderWidget);
  }

  function reset(target) {
    if (!window.turnstile) return;
    var widget = target && target.matches && target.matches("[data-turnstile-widget]")
      ? target
      : target && target.querySelector
        ? target.querySelector("[data-turnstile-widget]")
        : null;
    if (widget && widget.dataset.widgetId) {
      window.turnstile.reset(widget.dataset.widgetId);
      setToken(widget, "");
    }
  }

  window.luvBloomsTurnstileReady = renderAll;
  window.LUVBLOOMS_TURNSTILE = { renderAll: renderAll, reset: reset };
})();
