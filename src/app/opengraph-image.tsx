import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image de partage par défaut (réseaux sociaux, aperçus de lien).
// Les fiches biens / articles fournissent leur propre visuel.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #1b1b1e 0%, #303033 100%)",
          color: "#f3f0f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
          <span>Cabinet </span>
          <span style={{ color: "#b15f00", margin: "0 8px" }}>M</span>
          <span> Conseils</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
            Conseils juridiques &amp; immobilier au Bénin
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#cac6bf" }}>
            Rédaction d&apos;actes · Recouvrement · Conseil · Immobilier vérifié
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#b15f00", fontWeight: 700 }}>
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
