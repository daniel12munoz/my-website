// src/utils/cloudflareThumb.js
const DEFAULT_CUSTOMER = "j47qk7l1wwcd8bxv";

export function extractCloudflareStreamId(input) {
  if (!input || typeof input !== "string") return null;

  // Raw id (32 hex)
  if (/^[a-f0-9]{32}$/i.test(input.trim())) return input.trim();

  // Manifest: ...cloudflarestream.com/<id>/manifest/video.m3u8
  const m1 = input.match(/cloudflarestream\.com\/([a-f0-9]{32})\/manifest\/video\.m3u8/i);
  if (m1?.[1]) return m1[1];

  // Thumbnail: ...cloudflarestream.com/<id>/thumbnails/thumbnail.jpg
  const m2 = input.match(/cloudflarestream\.com\/([a-f0-9]{32})\/thumbnails\/thumbnail\.jpg/i);
  if (m2?.[1]) return m2[1];

  // Generic: ...cloudflarestream.com/<id>/
  const m3 = input.match(/cloudflarestream\.com\/([a-f0-9]{32})\//i);
  if (m3?.[1]) return m3[1];

  return null;
}

export function extractCloudflareCustomer(input) {
  if (!input || typeof input !== "string") return DEFAULT_CUSTOMER;
  const m = input.match(/customer-([^.]+)\.cloudflarestream\.com/i);
  return m?.[1] || DEFAULT_CUSTOMER;
}

export function cloudflareThumbnail(input, { time = "0s", width = 1280 } = {}) {
  const id = extractCloudflareStreamId(input);
  if (!id) return null;
  const customer = extractCloudflareCustomer(input);
  const w = Number.isFinite(Number(width)) ? Number(width) : 1280;
  // Keep first frame
  return `https://customer-${customer}.cloudflarestream.com/${id}/thumbnails/thumbnail.jpg?time=${encodeURIComponent(time)}&width=${w}`;
}
