// src/router/meta.ts

import { RouteLocationNormalized } from "vue-router";

const defaultTitle = "Bermentor - Platform Mentorship";
const defaultDescription = "Platform mentorship terbaik untuk semua kalangan.";
const baseUrl = window.location.origin;

// Fungsi untuk mengatur meta tag
const setMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (element) {
    element.setAttribute("content", content);
  } else {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    element.setAttribute("content", content);
    document.head.appendChild(element);
  }
};

// Fungsi untuk update meta tags berdasarkan route
export const updateMetaTags = (to: RouteLocationNormalized) => {
  document.title = (to.meta.title as string) || defaultTitle;

  setMetaTag(
    "description",
    (to.meta.description as string) || defaultDescription
  );
  setMetaTag("og:title", (to.meta.title as string) || defaultTitle);
  setMetaTag(
    "og:description",
    (to.meta.description as string) || defaultDescription
  );
  setMetaTag("og:url", baseUrl + to.fullPath);

  // Cek apakah halaman punya gambar atau nggak
  if (to.meta.image) {
    setMetaTag("og:image", baseUrl + (to.meta.image as string));
  } else {
    // Hapus meta tag `og:image` kalau nggak ada gambar di halaman
    const existingImageTag = document.querySelector('meta[name="og:image"]');
    if (existingImageTag) {
      existingImageTag.remove();
    }
  }
};
