(function () {
  "use strict";

  var config = window.LUVBLOOMS_CONFIG || {};
  var form;
  var statusEl;
  var successEl;
  var errorEl;
  var submitBtn;

  function showMessage(type, message) {
    if (statusEl) statusEl.textContent = message || "";
    if (successEl) {
      successEl.hidden = type !== "success";
      successEl.textContent = type === "success" ? message : "";
    }
    if (errorEl) {
      errorEl.hidden = type !== "error";
      errorEl.textContent = type === "error" ? message : "";
    }
  }

  function setMetadata() {
    form.elements.page_url.value = window.location.href;
    form.elements.user_agent.value = navigator.userAgent || "";
    form.elements.submission_timestamp.value = new Date().toISOString();
    if (window.LuvBloomsAttribution) window.LuvBloomsAttribution.applyToForm(form);
  }

  function serialize() {
    var fd = new FormData(form);
    var params = new URLSearchParams();
    fd.forEach(function (value, key) {
      if (params.has(key)) params.set(key, params.get(key) + ", " + value);
      else params.append(key, value);
    });
    return params;
  }

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  function init() {
    form = document.getElementById("lbInquiryForm");
    if (!form) return;

    statusEl = document.getElementById("formStatus");
    successEl = document.querySelector(".form-success");
    errorEl = document.querySelector(".form-error");
    submitBtn = form.querySelector('button[type="submit"]');
    setMetadata();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showMessage("", "");
      if (!form.reportValidity()) return;

      if (!form.elements.turnstile_token.value) {
        showMessage("error", "Please complete the security check before submitting.");
        dispatch("luvblooms:form-error", { form_name: "luvblooms_inquiry", error_message: "Turnstile not completed" });
        return;
      }

      setMetadata();
      showMessage("", "Sending your inquiry...");
      if (submitBtn) submitBtn.disabled = true;

      fetch(config.endpoints.inquiry, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: serialize().toString()
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (!data || data.ok !== true) throw new Error((data && data.message) || "Something went wrong. Please try again.");

          showMessage("success", "Your inquiry was sent. We’ll be in touch soon.");
          dispatch("luvblooms:form-success", { form_name: "luvblooms_inquiry", lead_type: form.elements.service_type.value || "inquiry" });
          form.reset();
          setMetadata();
          if (window.LUVBLOOMS_TURNSTILE) window.LUVBLOOMS_TURNSTILE.reset(form);
        })
        .catch(function (error) {
          showMessage("error", error.message || "Network error. Please try again.");
          dispatch("luvblooms:form-error", { form_name: "luvblooms_inquiry", error_message: error.message || "Network error" });
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
