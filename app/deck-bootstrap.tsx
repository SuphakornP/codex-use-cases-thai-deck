"use client";

import { useEffect } from "react";

function showLoadError() {
  document.documentElement.dataset.deckBootstrap = "error";
  const stage = document.querySelector<HTMLElement>("#deck-stage");
  if (!stage) return;

  stage.replaceChildren();
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = "ไม่สามารถโหลด presentation ได้ กรุณารีเฟรชหน้าแล้วลองอีกครั้ง";
  stage.append(message);
}

function loadScript(source: string, marker: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source;
    script.dataset.deckScript = marker;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${source}`)), { once: true });
    document.body.append(script);
  });
}

export function DeckBootstrap() {
  useEffect(() => {
    const status = document.documentElement.dataset.deckBootstrap;
    if (status === "loading" || status === "ready") return;

    document.documentElement.dataset.deckBootstrap = "loading";
    void loadScript("/data/usecases-data.js", "data")
      .then(() => loadScript("/script.js", "application"))
      .then(() => {
        document.documentElement.dataset.deckBootstrap = "ready";
      })
      .catch(showLoadError);
  }, []);

  return null;
}
