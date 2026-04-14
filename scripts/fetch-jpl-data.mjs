import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const targets = [
  {
    name: "planetary-physical-parameters",
    url: "https://ssd.jpl.nasa.gov/planets/phys_par.html"
  },
  {
    name: "satellite-physical-parameters",
    url: "https://ssd.jpl.nasa.gov/sats/phys_par/"
  },
  {
    name: "small-body-database",
    url: "https://ssd.jpl.nasa.gov/sbdb.cgi"
  }
];

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "solar-system-3d-data-fetcher"
    }
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${url} ${response.status}`);
  }

  return response.text();
}

async function run() {
  const outDir = resolve(process.cwd(), "data", "raw");
  await mkdir(outDir, { recursive: true });

  const fetchedAt = new Date().toISOString();
  const manifest = [];

  for (const target of targets) {
    const html = await fetchText(target.url);
    const fileName = `${target.name}.html`;
    const filePath = resolve(outDir, fileName);
    await writeFile(filePath, html, "utf8");

    manifest.push({
      name: target.name,
      url: target.url,
      file: fileName,
      bytes: html.length,
      fetchedAt
    });
  }

  await writeFile(resolve(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  console.log("JPL 原始数据页面已抓取到 data/raw。");
  console.log("下一步: 在 scripts 目录添加解析器，将 HTML 转为标准化 JSON。\n");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
