import L from "leaflet";

const iconUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl,
});
