import { ImageResponse } from "next/og";

import { about } from "@/content/about";
import { siteUrl } from "@/lib/seo";

export const alt = `${about.name} — ${about.positioning}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  let host = "radovssky.ru";
  try {
    host = new URL(siteUrl).host;
  } catch {
    // fallback already set
  }

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
          backgroundColor: "#0b1012",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(21,230,209,0.32), transparent 55%), radial-gradient(circle at 85% 95%, rgba(21,230,209,0.20), transparent 55%)",
          color: "#eaf3f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "30px",
          }}
        >
          <span style={{ color: "#15e6d1" }}>{"</>"}</span>
          <span style={{ color: "rgba(234,243,240,0.85)" }}>{host}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <span style={{ color: "#15e6d1", fontSize: "32px" }}>
            {"// automation engineer"}
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "82px",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
            }}
          >
            <span>Сотрудники, которые</span>
            <span>не спят, не болеют</span>
            <span style={{ display: "flex" }}>
              и не увольняются
              <span style={{ color: "#15e6d1" }}>_</span>
            </span>
          </div>
          <span
            style={{
              fontSize: "38px",
              color: "rgba(234,243,240,0.72)",
              lineHeight: 1.3,
            }}
          >
            чат-боты, голосовые ассистенты, контент-агенты
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "28px",
            color: "rgba(234,243,240,0.6)",
          }}
        >
          <span>{about.telegram}</span>
          <span>{about.city} · RU</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
