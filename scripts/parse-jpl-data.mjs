import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { load } from "cheerio";

const G = 6.67430e-11;

function toId(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").replace(/±/g, "").trim();
}

function firstNumber(text) {
  const cleaned = cleanText(text).replace(/,/g, "");
  const match = cleaned.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/i);
  return match ? Number(match[0]) : null;
}

function parsePlanetTables(html) {
  const $ = load(html);
  const tables = $("table.planet-phys-par").toArray();
  const entries = [];

  tables.forEach((table, index) => {
    const isDwarf = index > 0;
    const massPower = isDwarf ? 18 : 24;

    $(table)
      .find("tbody > tr")
      .each((_, tr) => {
        const cells = $(tr).find("td");
        if (cells.length < 7) {
          return;
        }

        const name = cleanText($(cells[0]).text());
        const meanRadius = firstNumber($(cells[2]).text());
        const massScaled = firstNumber($(cells[3]).text());
        const rotationDays = firstNumber($(cells[5]).text());
        const orbitalYears = firstNumber($(cells[6]).text());

        if (!name || meanRadius === null || massScaled === null) {
          return;
        }

        entries.push({
          id: toId(name),
          name,
          kind: isDwarf ? "dwarf" : "planet",
          massKg: massScaled * 10 ** massPower,
          meanRadiusKm: meanRadius,
          rotationPeriodDays: rotationDays,
          orbitalPeriodYears: orbitalYears,
          source: "JPL Planetary Physical Parameters"
        });
      });
  });

  return entries;
}

function parseSatellites(html) {
  const $ = load(html);
  const entries = [];

  $("#sat_phys_par tbody tr").each((_, tr) => {
    const cells = $(tr).find("td");
    if (cells.length < 9) {
      return;
    }

    const parent = cleanText($(cells[0]).text());
    const name = cleanText($(cells[1]).text());
    const gm = firstNumber($(cells[3]).text());
    const meanRadius = firstNumber($(cells[6]).text());
    const density = firstNumber($(cells[9]).text());

    if (!parent || !name || gm === null || meanRadius === null) {
      return;
    }

    entries.push({
      id: toId(name),
      name,
      kind: "satellite",
      parentName: parent,
      gmKm3s2: gm,
      massKg: (gm * 1e9) / G,
      meanRadiusKm: meanRadius,
      densityGcm3: density,
      source: "JPL Planetary Satellite Physical Parameters"
    });
  });

  return entries;
}

async function run() {
  const root = process.cwd();
  const rawDir = resolve(root, "data", "raw");
  const outDir = resolve(root, "data", "normalized");
  await mkdir(outDir, { recursive: true });

  const planetHtml = await readFile(resolve(rawDir, "planetary-physical-parameters.html"), "utf8");
  const satelliteHtml = await readFile(resolve(rawDir, "satellite-physical-parameters.html"), "utf8");

  const planets = parsePlanetTables(planetHtml);
  const satellites = parseSatellites(satelliteHtml);

  const payload = {
    generatedAt: new Date().toISOString(),
    units: {
      massKg: "kg",
      meanRadiusKm: "km",
      orbitalPeriodYears: "year",
      rotationPeriodDays: "day"
    },
    counts: {
      planetsAndDwarfs: planets.length,
      satellites: satellites.length
    },
    planets,
    satellites
  };

  await writeFile(resolve(outDir, "jpl-celestial-bodies.json"), JSON.stringify(payload, null, 2), "utf8");
  console.log(`解析完成: planets+dwarfs=${planets.length}, satellites=${satellites.length}`);
  console.log("输出: data/normalized/jpl-celestial-bodies.json");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
