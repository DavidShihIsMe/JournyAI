#!/usr/bin/env node
// Downloads GeoNames cities15000 + countryInfo, processes into a lean JSON
// at web/public/cities.json for the destination autocomplete.
//
// Data: https://download.geonames.org/export/dump/  (CC BY 4.0)
// Run:  node scripts/build-cities.mjs

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TMP = join(tmpdir(), "journy-cities-build");
const OUT = join(ROOT, "web", "public", "cities.json");

const CITIES_URL = "https://download.geonames.org/export/dump/cities15000.zip";
const COUNTRY_URL = "https://download.geonames.org/export/dump/countryInfo.txt";

async function download(url, dest) {
  console.log(`Downloading ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log(`  → ${dest} (${(buf.length / 1024).toFixed(1)} KB)`);
}

if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true });

const zipPath = join(TMP, "cities15000.zip");
const txtPath = join(TMP, "cities15000.txt");
const countryPath = join(TMP, "countryInfo.txt");

await download(CITIES_URL, zipPath);
await download(COUNTRY_URL, countryPath);

console.log(`Extracting ${zipPath}`);
if (process.platform === "win32") {
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${TMP}' -Force"`,
    { stdio: "inherit" }
  );
} else {
  execSync(`tar -xf "${zipPath}" -C "${TMP}"`, { stdio: "inherit" });
}

// Parse countryInfo.txt — columns: ISO\tISO3\t...\tCountry\t...
const countries = {};
for (const line of readFileSync(countryPath, "utf8").split("\n")) {
  if (!line || line.startsWith("#")) continue;
  const cols = line.split("\t");
  const iso = cols[0]?.trim();
  const name = cols[4]?.trim();
  if (iso && iso.length === 2 && name) countries[iso] = name;
}

// Parse cities15000.txt — columns (GeoNames spec):
// 0 id 1 name 2 ascii 3 alt 4 lat 5 lon 6 fclass 7 fcode 8 cc 9 cc2
// 10 admin1 11 admin2 12 admin3 13 admin4 14 pop 15 elev 16 dem 17 tz 18 mod
const cities = [];
for (const line of readFileSync(txtPath, "utf8").split("\n")) {
  if (!line.trim()) continue;
  const cols = line.split("\t");
  if (cols.length < 15) continue;
  const name = cols[1].trim();
  const ascii = cols[2].trim();
  const cc = cols[8].trim();
  const admin1 = cols[10].trim();
  const pop = Number(cols[14]) || 0;
  if (!name || !cc) continue;
  // 5-tuple [name, ascii-if-different, cc, admin1, pop]
  cities.push([name, ascii === name ? "" : ascii, cc, admin1, pop]);
}

// Sort by population so common cities surface first under any query
cities.sort((a, b) => b[4] - a[4]);

if (!existsSync(dirname(OUT))) mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ countries, cities }));

const bytes = readFileSync(OUT).length;
console.log(
  `Wrote ${cities.length.toLocaleString()} cities + ${Object.keys(countries).length} countries → ${OUT} (${(bytes / 1024).toFixed(1)} KB)`
);
