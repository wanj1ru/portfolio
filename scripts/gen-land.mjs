// Generates content/land-dots.json: evenly spaced [lat, lon] points that fall on land.
// Run with: node scripts/gen-land.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const STEP = 2.2; // degrees between rows
const dots = [];
for (let lat = -58; lat <= 78; lat += STEP) {
  const ring = Math.max(1, Math.round((360 / STEP) * Math.cos((lat * Math.PI) / 180)));
  for (let i = 0; i < ring; i++) {
    const lon = -180 + (i * 360) / ring;
    if (geoContains(land, [lon, lat])) dots.push([+lat.toFixed(2), +lon.toFixed(2)]);
  }
}
writeFileSync(new URL("../content/land-dots.json", import.meta.url), JSON.stringify(dots));
console.log(`wrote ${dots.length} land dots`);
