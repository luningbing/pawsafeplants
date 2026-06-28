window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", "G-NWHFZH1Z7E");

const gaScript = document.createElement("script");
gaScript.async = true;
gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-NWHFZH1Z7E";
document.head.appendChild(gaScript);

function getFieldValue(id) {
  const field = document.getElementById(id);
  return field && "value" in field ? field.value : undefined;
}

function getSectionLabel(element) {
  const section = element.closest("section");
  return section ? section.getAttribute("aria-label") || section.id || "page" : "page";
}

function getLinkPath(link) {
  if (!link || !link.href) return undefined;
  if (link.href.startsWith("mailto:")) return "mailto";

  try {
    const url = new URL(link.href);
    return url.origin === window.location.origin ? url.pathname : url.hostname;
  } catch (error) {
    return undefined;
  }
}

function builderContext(extra = {}) {
  return {
    page_path: window.location.pathname,
    page_title: document.title,
    channel: getFieldValue("channel"),
    store_platform: getFieldValue("platform"),
    setup_mode: getFieldValue("setupMode"),
    ga4_status: getFieldValue("ga4Status"),
    transport_type: "beacon",
    ...extra
  };
}

function sendTrackingEvent(eventName, params = {}) {
  if (typeof gtag !== "function") return;
  gtag("event", eventName, builderContext(params));
}

document.addEventListener("click", event => {
  const target = event.target.closest("a, button");
  if (!target) return;

  if (target.id === "copyUrl") {
    sendTrackingEvent("campaign_url_copied", { event_location: "builder" });
    return;
  }

  if (target.id === "copySetupBrief") {
    sendTrackingEvent("ad_setup_brief_copied", { event_location: "builder" });
    return;
  }

  if (target.id === "copyReadinessPlan") {
    sendTrackingEvent("launch_readiness_plan_copied", { event_location: "builder" });
    return;
  }

  if (target.id === "generateBulkUrls") {
    sendTrackingEvent("bulk_urls_generated", { event_location: "bulk_builder" });
    return;
  }

  if (target.id === "copyBulkCsv") {
    sendTrackingEvent("bulk_csv_copied", { event_location: "bulk_builder" });
    return;
  }

  if (target.id === "downloadBulkCsv") {
    sendTrackingEvent("bulk_csv_downloaded", { event_location: "bulk_builder" });
    return;
  }

  if (target.id === "runUrlQa") {
    sendTrackingEvent("ad_url_qa_checked", { event_location: "url_qa_checker" });
    return;
  }

  if (target.id === "copyQaSummary") {
    sendTrackingEvent("ad_url_qa_summary_copied", { event_location: "url_qa_checker" });
    return;
  }

  if (target.id === "downloadQaReport") {
    sendTrackingEvent("tracking_qa_report_downloaded", { event_location: "builder" });
    return;
  }

  if (target.id === "downloadCsv") {
    sendTrackingEvent("campaign_csv_downloaded", { event_location: "builder" });
    return;
  }

  if (target.id === "downloadChecklist") {
    sendTrackingEvent("ga4_checklist_downloaded", { event_location: "builder" });
    return;
  }

  if (target.id === "copyTemplate") {
    sendTrackingEvent("manual_intake_copied", { event_location: "manual_setup_service" });
    return;
  }

  if (target.id === "downloadTemplate") {
    sendTrackingEvent("manual_intake_downloaded", { event_location: "manual_setup_service" });
    return;
  }

  if (target.matches("a[href^='mailto:']")) {
    sendTrackingEvent("manual_setup_email_clicked", {
      event_location: getSectionLabel(target),
      link_path: "mailto"
    });
    return;
  }

  if (target.matches("a[href*='manual-url-setup-service']")) {
    sendTrackingEvent("manual_setup_cta_clicked", {
      event_location: getSectionLabel(target),
      link_path: getLinkPath(target)
    });
    return;
  }

  if (target.matches("a[href*='sample-tracking-qa-report']")) {
    sendTrackingEvent("sample_report_cta_clicked", {
      event_location: getSectionLabel(target),
      link_path: getLinkPath(target)
    });
    return;
  }

  if (target.matches("a[href*='bulk-utm-builder']")) {
    sendTrackingEvent("bulk_builder_cta_clicked", {
      event_location: getSectionLabel(target),
      link_path: getLinkPath(target)
    });
    return;
  }

  if (target.matches("a[href*='ad-url-qa-checker']")) {
    sendTrackingEvent("ad_url_qa_checker_cta_clicked", {
      event_location: getSectionLabel(target),
      link_path: getLinkPath(target)
    });
    return;
  }

  if (target.matches("a[href$='#builder'], a[href='../#builder'], a[href='/#builder'], a[href$='#tool'], a[href='../#tool'], a[href='/#tool']")) {
    sendTrackingEvent("builder_cta_clicked", {
      event_location: getSectionLabel(target),
      link_path: getLinkPath(target)
    });
  }
});
