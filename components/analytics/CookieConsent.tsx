"use client";

import { useState, useEffect } from "react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: "accepted" }));
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: "declined" }));
  }

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-inner">
        <p>We use analytics cookies to improve your experience. You can accept or decline.</p>
        <div className="cookie-consent-actions">
          <button className="btn btn-primary btn-sm" onClick={accept}>Accept</button>
          <button className="btn btn-ghost btn-sm" onClick={decline}>Decline</button>
        </div>
      </div>
    </div>
  );
}
