(function () {
  "use strict";

  var STORAGE_KEY = "luvblooms_attribution_v1";
  var SESSION_KEY = "luvblooms_session_id";
  var VISITOR_KEY = "luvblooms_visitor_id";
  var CLICK_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"];
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return prefix + "_" + window.crypto.randomUUID();
    }
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function readStorage(key, session) {
    try {
      return (session ? sessionStorage : localStorage).getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function writeStorage(key, value, session) {
    try {
      (session ? sessionStorage : localStorage).setItem(key, value);
    } catch (error) {}
  }

  function getJson() {
    try {
      return JSON.parse(readStorage(STORAGE_KEY, false)) || {};
    } catch (error) {
      return {};
    }
  }

  function getOrCreateId(key, prefix, session) {
    var value = readStorage(key, session);
    if (!value) {
      value = makeId(prefix);
      writeStorage(key, value, session);
    }
    return value;
  }

  function searchParams() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (error) {
      return new URLSearchParams();
    }
  }

  function campaignFromUrl() {
    var params = searchParams();
    var values = {};
    UTM_KEYS.concat(CLICK_KEYS).forEach(function (key) {
      values[key] = params.get(key) || "";
    });
    return values;
  }

  function inferSource(values) {
    if (values.utm_source) return values.utm_source;
    if (values.gclid || values.gbraid || values.wbraid) return "google";
    if (values.fbclid) return "facebook";
    if (values.msclkid) return "microsoft";
    if (values.ttclid) return "tiktok";

    if (document.referrer) {
      try {
        var referrer = new URL(document.referrer);
        if (referrer.hostname !== window.location.hostname) return referrer.hostname;
      } catch (error) {}
    }

    return "direct";
  }

  function inferMedium(values) {
    if (values.utm_medium) return values.utm_medium;
    if (values.gclid || values.gbraid || values.wbraid || values.fbclid || values.msclkid || values.ttclid) return "paid";
    if (document.referrer) return "referral";
    return "none";
  }

  function touchFromPage(values) {
    return {
      source: inferSource(values),
      medium: inferMedium(values),
      campaign: values.utm_campaign || "",
      content: values.utm_content || "",
      term: values.utm_term || "",
      landing_page: window.location.href,
      referrer: document.referrer || "",
      captured_at: new Date().toISOString()
    };
  }

  function capture() {
    var stored = getJson();
    var values = campaignFromUrl();
    var hasCampaign = UTM_KEYS.concat(CLICK_KEYS).some(function (key) { return Boolean(values[key]); });
    var touch = touchFromPage(values);

    stored.visitor_id = getOrCreateId(VISITOR_KEY, "visitor", false);
    stored.session_id = getOrCreateId(SESSION_KEY, "session", true);
    stored.contact_intent_id = stored.contact_intent_id || makeId("intent");
    stored.first_touch = stored.first_touch || touch;

    if (hasCampaign || !stored.last_touch) stored.last_touch = touch;

    UTM_KEYS.concat(CLICK_KEYS).forEach(function (key) {
      if (values[key]) stored[key] = values[key];
    });

    writeStorage(STORAGE_KEY, JSON.stringify(stored), false);
    return stored;
  }

  function fields(record) {
    var first = record.first_touch || {};
    var last = record.last_touch || {};
    var values = {
      attribution_visitor_id: record.visitor_id || "",
      attribution_session_id: record.session_id || "",
      attribution_contact_intent_id: record.contact_intent_id || "",
      attribution_first_source: first.source || "",
      attribution_first_medium: first.medium || "",
      attribution_first_campaign: first.campaign || "",
      attribution_first_landing_page: first.landing_page || "",
      attribution_first_referrer: first.referrer || "",
      attribution_last_source: last.source || "",
      attribution_last_medium: last.medium || "",
      attribution_last_campaign: last.campaign || "",
      attribution_last_landing_page: last.landing_page || "",
      attribution_last_referrer: last.referrer || ""
    };

    UTM_KEYS.concat(CLICK_KEYS).forEach(function (key) {
      values[key] = record[key] || "";
    });

    return values;
  }

  function applyToForm(form) {
    var values = fields(capture());

    Object.keys(values).forEach(function (name) {
      var input = form.querySelector('input[name="' + name + '"]');
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
      }
      input.value = values[name];
    });
  }

  function applyAll() {
    document.querySelectorAll("form[data-analytics-form]").forEach(applyToForm);
  }

  window.LuvBloomsAttribution = {
    capture: capture,
    getFields: function () { return fields(capture()); },
    applyToForm: applyToForm
  };

  capture();
  document.addEventListener("DOMContentLoaded", applyAll);
  document.addEventListener("submit", function (event) {
    var form = event.target.closest("form[data-analytics-form]");
    if (form) applyToForm(form);
  }, true);
})();
