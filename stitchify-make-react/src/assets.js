// Populates the runtime globals the MAKE components read from.
// Import this once, before rendering, in your entry file.
import { ICONS } from "./icons.js";
import { IMAGES } from "./images.js";

if (typeof window !== "undefined") {
  window._ICONS = ICONS;   // Ic component reads icon SVG inner-HTML from here
  window._D = IMAGES;      // resolveImg() reads base64 image data URIs from here
}
