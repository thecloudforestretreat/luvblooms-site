(function () {
  "use strict";

  var config = window.LUVBLOOMS_CONFIG || {};
  var gtmId = config.googleTagManagerId || "";
  var gaId = config.googleAnalyticsId || "";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function appendScript(src, attrs) {
    if (document.querySelector('script[src="' + src + '"]')) return;

    var script = document.createElement("script");
    script.async = true;
    script.src = src;

    Object.keys(attrs || {}).forEach(function (key) {
      script.setAttribute(key, attrs[key]);
    });

    document.head.appendChild(script);
  }

  if (/^GTM-[A-Z0-9]+$/.test(gtmId)) {
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js"
    });
    appendScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId));
  } else if (/^G-[A-Z0-9]+$/.test(gaId)) {
    window.gtag("js", new Date());
    window.gtag("config", gaId, {
      send_page_view: true,
      page_path: window.location.pathname,
      page_title: document.title
    });
    appendScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId));
  }
})();
