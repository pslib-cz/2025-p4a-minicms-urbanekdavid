"use client";

import { useEffect, useState } from "react";

export function ClarityProvider() {
  const [enabled, setEnabled] = useState(false);
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      setEnabled(true);
    }

    function handleChange(e: Event) {
      const detail = (e as CustomEvent).detail;
      setEnabled(detail === "accepted");
    }

    window.addEventListener("cookie-consent-change", handleChange);
    return () => window.removeEventListener("cookie-consent-change", handleChange);
  }, []);

  useEffect(() => {
    if (!enabled || !clarityId) return;

    if (document.querySelector('script[data-clarity]')) return;

    const script = document.createElement("script");
    script.setAttribute("data-clarity", "true");
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `;
    document.head.appendChild(script);
  }, [enabled, clarityId]);

  return null;
}
