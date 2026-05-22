(function () {
  "use strict";

  var currentScript = document.currentScript;
  var clientId = currentScript && currentScript.getAttribute("data-client-id");
  var loaderOrigin = currentScript && currentScript.src ? new URL(currentScript.src).origin : window.location.origin;

  if (!clientId) {
    console.warn("[ConversionHub] data-client-id가 없습니다.");
    return;
  }

  window.__conversionHub = window.__conversionHub || {};
  window.__conversionHub.loadedClients = window.__conversionHub.loadedClients || {};

  if (window.__conversionHub.loadedClients[clientId]) {
    console.warn("[ConversionHub] 동일 Client ID의 통합 스크립트가 이미 실행되었습니다.");
    return;
  }

  window.__conversionHub.loadedClients[clientId] = true;

  fetch(loaderOrigin + "/api/tags?clientId=" + encodeURIComponent(clientId), { credentials: "omit" })
    .then(function (response) {
      if (!response.ok) throw new Error("태그 설정을 불러오지 못했습니다.");
      return response.json();
    })
    .then(function (config) {
      installEnabledTags(config.tags || {});
      runMatchedEvents(config);
    })
    .catch(function (error) {
      console.warn("[ConversionHub]", error.message || error);
    });

  function insertScript(src, id, onload) {
    if (id && document.getElementById(id)) {
      if (onload) onload();
      return;
    }
    var script = document.createElement("script");
    script.async = true;
    if (id) script.id = id;
    script.src = src;
    if (onload) script.onload = onload;
    document.head.appendChild(script);
  }

  function installEnabledTags(tags) {
    if (tags.ga4 && tags.ga4.enabled && tags.ga4.measurementId) {
      ensureGtag(tags.ga4.measurementId);
      window.gtag("config", tags.ga4.measurementId);
    }

    if (tags.googleAds && tags.googleAds.enabled && tags.googleAds.conversionId) {
      ensureGtag(tags.googleAds.conversionId);
      window.gtag("config", tags.googleAds.conversionId);
    }

    if (tags.meta && tags.meta.enabled && tags.meta.pixelId) {
      ensureMeta(tags.meta.pixelId);
    }

    if (tags.naver && tags.naver.enabled && tags.naver.scriptIdOrCode) {
      injectRawOrPlaceholder("conversionhub-naver", tags.naver.scriptIdOrCode, function () {
        window.wcs = window.wcs || {};
      });
    }

    if (tags.danggeun && tags.danggeun.enabled && tags.danggeun.scriptIdOrCode) {
      injectRawOrPlaceholder("conversionhub-danggeun", tags.danggeun.scriptIdOrCode, function () {
        window.danggeunPixel = window.danggeunPixel || function () {
          (window.danggeunPixel.q = window.danggeunPixel.q || []).push(arguments);
        };
      });
    }
  }

  function ensureGtag(id) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    insertScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id), "conversionhub-gtag");
  }

  function ensureMeta(pixelId) {
    if (!window.fbq) {
      window.fbq = function () {
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
      };
      window.fbq.queue = [];
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      insertScript("https://connect.facebook.net/en_US/fbevents.js", "conversionhub-meta");
    }
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  function injectRawOrPlaceholder(id, value, fallback) {
    if (document.getElementById(id)) return;
    if (/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(value)) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = value;
      Array.prototype.forEach.call(wrapper.querySelectorAll("script"), function (source) {
        var script = document.createElement("script");
        if (source.src) script.src = source.src;
        script.async = true;
        script.id = id;
        script.text = source.text || source.textContent || "";
        document.head.appendChild(script);
      });
    } else if (fallback) {
      fallback(value);
    }
  }

  function runMatchedEvents(config) {
    var tags = config.tags || {};
    var events = config.events || [];
    var href = window.location.href;

    events.forEach(function (event) {
      if (!event.enabled) return;
      if (event.urlContains && href.indexOf(event.urlContains) === -1) return;
      if (!event.urlContains && event.key !== "PageView") return;

      var eventKey = "conversionHub:" + clientId + ":" + event.key + ":" + window.location.pathname;
      if (sessionStorage.getItem(eventKey)) return;
      sessionStorage.setItem(eventKey, "1");

      var payload = buildPayload(event);
      dispatchEventToMedia(event.key, payload, tags);
    });
  }

  function buildPayload(event) {
    var payload = {};
    if (event.useValue && event.revenueVariableName && window[event.revenueVariableName] != null) {
      payload.value = Number(window[event.revenueVariableName]) || window[event.revenueVariableName];
    }
    if (event.orderIdVariableName && window[event.orderIdVariableName] != null) {
      payload.transaction_id = String(window[event.orderIdVariableName]);
    }
    return payload;
  }

  function dispatchEventToMedia(eventName, payload, tags) {
    var googleEventName = mapGoogleEvent(eventName);
    var metaEventName = mapMetaEvent(eventName);

    if (window.gtag && tags.ga4 && tags.ga4.enabled) {
      window.gtag("event", googleEventName, payload);
    }

    if (window.gtag && tags.googleAds && tags.googleAds.enabled && tags.googleAds.conversionId && tags.googleAds.conversionLabel) {
      window.gtag("event", "conversion", Object.assign({}, payload, {
        send_to: tags.googleAds.conversionId + "/" + tags.googleAds.conversionLabel
      }));
    }

    if (window.fbq && tags.meta && tags.meta.enabled) {
      window.fbq("track", metaEventName, payload);
    }

    if (window.wcs && tags.naver && tags.naver.enabled) {
      window.wcs.conversion = Object.assign({ type: eventName }, payload);
      if (typeof window.wcs_do === "function") window.wcs_do();
    }

    if (window.danggeunPixel && tags.danggeun && tags.danggeun.enabled) {
      window.danggeunPixel("track", eventName, payload);
    }
  }

  function mapGoogleEvent(eventName) {
    var map = {
      PageView: "page_view",
      ViewContent: "view_item",
      AddToCart: "add_to_cart",
      BeginCheckout: "begin_checkout",
      Purchase: "purchase",
      CompleteRegistration: "sign_up",
      Lead: "generate_lead"
    };
    return map[eventName] || eventName;
  }

  function mapMetaEvent(eventName) {
    var map = {
      PageView: "PageView",
      ViewContent: "ViewContent",
      AddToCart: "AddToCart",
      BeginCheckout: "InitiateCheckout",
      Purchase: "Purchase",
      CompleteRegistration: "CompleteRegistration",
      Lead: "Lead"
    };
    return map[eventName] || eventName;
  }
})();
