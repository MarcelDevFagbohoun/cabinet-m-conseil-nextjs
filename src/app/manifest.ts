import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Cabinet M",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8fc",
    theme_color: "#8d4b00",
    lang: "fr",
    icons: [
      { src: "/icon.png", sizes: "500x500", type: "image/png" },
      { src: "/apple-icon.png", sizes: "500x500", type: "image/png", purpose: "maskable" },
    ],
  };
}
