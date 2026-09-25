(function () {
  "use strict";

  var hostname = window.location.hostname.toLowerCase();
  var productionHosts = ["luvblooms.us", "www.luvblooms.us", "luvblooms-site.pages.dev"];
  var isProduction = productionHosts.indexOf(hostname) !== -1;

  var config = {
    siteName: "LuvBlooms",
    siteUrl: "https://luvblooms.us",
    sourceSite: "luvblooms",
    sourceDomain: "luvblooms.us",
    environment: isProduction ? "production" : "staging",
    googleTagManagerId: isProduction ? "GTM-PJH5TLWQ" : "",
    googleAnalyticsId: isProduction ? "G-T3XJE3NV2Y" : "",
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
      inquiry: "Hi LuvBlooms! I am interested in starting a floral inquiry.",
      home_general: "Hi LuvBlooms! I found your website and would like to learn more about your floral services.",
      service_general: "Hi LuvBlooms! I would like to discuss a floral design service.",
      arrangement: "Hi LuvBlooms! I would like to request a custom floral arrangement.",
      brand_event: "Hi LuvBlooms! I would like to discuss florals for a brand event or activation.",
      intimate_event: "Hi LuvBlooms! I would like to discuss florals for an intimate event.",
      consultation: "Hi LuvBlooms! I would like to schedule a floral design consultation.",
      home_general_es: "¡Hola, LuvBlooms! Encontré su sitio y quisiera conocer más sobre sus servicios florales.",
      service_general_es: "¡Hola, LuvBlooms! Quisiera conversar sobre un servicio de diseño floral.",
      arrangement_es: "¡Hola, LuvBlooms! Quisiera solicitar un arreglo floral personalizado.",
      brand_event_es: "¡Hola, LuvBlooms! Quisiera conversar sobre flores para un evento de marca o activación.",
      intimate_event_es: "¡Hola, LuvBlooms! Quisiera conversar sobre flores para un evento íntimo.",
      consultation_es: "¡Hola, LuvBlooms! Quisiera programar una consultoría de diseño floral."
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
