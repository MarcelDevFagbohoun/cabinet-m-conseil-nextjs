import Script from "next/script";

// Microsoft Clarity (analyse d'audience / heatmaps / enregistrements de session).
// ID surchargable via NEXT_PUBLIC_CLARITY_ID ; chargé uniquement en production
// pour ne pas polluer les stats avec les sessions de développement.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "yd0ymzut8x";

export default function Clarity() {
  if (process.env.NODE_ENV !== "production" || !CLARITY_ID) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_ID}");`}
    </Script>
  );
}
