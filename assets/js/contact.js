(function () {
  "use strict";

  var config = window.LUVBLOOMS_CONFIG || {};

  function capitalizeName(value) {
    return (value || "")
      .toLowerCase()
      .replace(/\b([a-z])/g, function (match) {
        return match.toUpperCase();
      })
      .replace(/\s+/g, " ")
      .trimStart();
  }

  function setupNameAutoCapitalization() {
    var fields = document.querySelectorAll('[data-auto-capitalize="words"]');

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        var start = field.selectionStart;
        var end = field.selectionEnd;

        field.value = capitalizeName(field.value);

        try {
          field.setSelectionRange(start, end);
        } catch (error) {}
      });

      field.addEventListener("blur", function () {
        field.value = capitalizeName(field.value).trim();
      });
    });
  }

  function formatPhone(value) {
    var digits = (value || "").replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) {
      return digits ? "(" + digits : "";
    }

    if (digits.length <= 6) {
      return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    }

    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function setupPhoneMask() {
    var phone = document.getElementById("phone");

    if (!phone) return;

    phone.addEventListener("input", function () {
      phone.value = formatPhone(phone.value);
    });
  }

  function setHiddenFields() {
    var timestamp = document.getElementById("client_timestamp");
    var userAgent = document.getElementById("user_agent");

    if (timestamp) timestamp.value = new Date().toISOString();
    if (userAgent) userAgent.value = navigator.userAgent || "";
  }

  function showMessage(type, message) {
    var statusEl = document.getElementById("formStatus");

    if (!statusEl) return;

    statusEl.textContent = message || "";
    statusEl.classList.remove("is-success", "is-error");

    if (type === "success") {
      statusEl.classList.add("is-success");
    }

    if (type === "error") {
      statusEl.classList.add("is-error");
    }
  }

  function safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return {};
    }
  }

  function serialize(form) {
    var fd = new FormData(form);
    var params = new URLSearchParams();

    fd.forEach(function (value, key) {
      params.append(key, value);
    });

    var token = fd.get("cf-turnstile-response");

    if (token && !params.has("turnstile_token")) {
      params.append("turnstile_token", token);
    }

    return params;
  }

  function setupSubmit() {
    var form = document.getElementById("lbContactForm");
    var submitBtn = document.getElementById("submitBtn");

    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      showMessage("", "");

      if (!form.reportValidity()) return;

      var phone = document.getElementById("phone");
      var phoneDigits = phone ? phone.value.replace(/\D/g, "") : "";

      if (phoneDigits.length !== 10) {
        showMessage("error", "Please enter a valid phone number in this format: (555) 555-5555.");
        if (phone) phone.focus();
        return;
      }

      var turnstileTokenField = form.querySelector('[name="cf-turnstile-response"]');

      if (!turnstileTokenField || !turnstileTokenField.value) {
        showMessage("error", "Please complete the security check before submitting.");
        return;
      }

      setHiddenFields();
      if (window.LuvBloomsAttribution) window.LuvBloomsAttribution.applyToForm(form);
      showMessage("", "Sending your inquiry...");

      if (submitBtn) submitBtn.disabled = true;

      fetch(config.endpoints.contact, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: serialize(form).toString()
      })
        .then(function (response) {
          return response.text().then(function (text) {
            return {
              ok: response.ok,
              json: safeJsonParse(text)
            };
          });
        })
        .then(function (result) {
          if (!result.ok || !result.json || result.json.ok !== true) {
            throw new Error((result.json && result.json.message) || "Something went wrong. Please try again.");
          }

          showMessage("success", "Your inquiry was sent. We will be in touch soon.");
          document.dispatchEvent(new CustomEvent("luvblooms:form-success", {
            detail: {
              form_name: "luvblooms_contact",
              lead_type: form.elements.interest_type.value || "floral_inquiry"
            }
          }));
          form.reset();
          setHiddenFields();

          if (window.LUVBLOOMS_TURNSTILE) window.LUVBLOOMS_TURNSTILE.reset(form);
        })
        .catch(function (error) {
          showMessage("error", error.message || "Network error. Please try again.");
          document.dispatchEvent(new CustomEvent("luvblooms:form-error", {
            detail: {
              form_name: "luvblooms_contact",
              error_message: error.message || "Network error"
            }
          }));
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setHiddenFields();
    setupNameAutoCapitalization();
    setupPhoneMask();
    setupSubmit();
  });
})();
