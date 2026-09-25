(function () {
  "use strict";

  var config = {
    siteName: "LuvBlooms",
    siteUrl: "https://luvblooms.us",
    sourceSite: "luvblooms",
    sourceDomain: "luvblooms.us",
    googleTagManagerId: "GTM-PJH5TLWQ",
    googleAnalyticsId: "G-T3XJE3NV2Y",
    turnstileSiteKey: "0x4AAAAAADOtXOriiveud1Pw",
    contactEmail: "luvblooms.us@gmail.com",
    whatsappNumber: "13057937727",
    endpoints: {
      contact: "https://script.google.com/macros/s/AKfycbw8AxsZjd7AUXHfdcBXxgEYGA0bsJGGKm_nTr6tUgnxQqNVN7tTWTEy3WZsm_0kiO2N/exec",
      inquiry: "https://script.google.com/macros/s/AKfycbzLvL3-Lw5T2GFBkypn45toSleU5cjz85IV1-GskYPD0NGKpbtmxHcn0ZlUp5G9mP3l/exec"
    },
    whatsappMessages: {
      default: "Hi LuvBlooms! I found you through your website and would love to learn more.",
      contact: "Hi LuvBlooms! I would like to discuss a floral project.",
      inquiry: "Hi LuvBlooms! I am interested in starting a floral inquiry."
    }
  };

  function whatsappUrl(messageKey) {
    var message = config.whatsappMessages[messageKey] || config.whatsappMessages.default;
    return "https://wa.me/" + config.whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function updateContactLinks(root) {
    var scope = root || document;

    scope.querySelectorAll("[data-whatsapp-message-key]").forEach(function (link) {
      link.href = whatsappUrl(link.getAttribute("data-whatsapp-message-key") || "default");
    });

    scope.querySelectorAll("[data-luvblooms-email]").forEach(function (link) {
      link.href = "mailto:" + config.contactEmail;
      if (!link.textContent.trim()) link.textContent = config.contactEmail;
    });
  }

  window.LUVBLOOMS_CONFIG = config;
  window.LUVBLOOMS_CONTACTS = {
    update: updateContactLinks,
    whatsappUrl: whatsappUrl
  };
})();
