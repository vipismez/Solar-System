import type { CelestialBody } from "../types/celestial";

const kindLabelMap: Record<CelestialBody["kind"], string> = {
  star: "恒星",
  planet: "行星",
  dwarf: "矮行星",
  satellite: "卫星"
};

function formatScientific(value: number): string {
  return value.toExponential(3);
}

function formatMaybe(value?: number, digits = 4): string {
  if (value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return value.toFixed(digits);
}

function volumeKm3(radiusKm: number): number {
  return (4 / 3) * Math.PI * radiusKm * radiusKm * radiusKm;
}

interface BodyInfoPanelProps {
  body: CelestialBody | null;
}

export function BodyInfoPanel({ body }: BodyInfoPanelProps) {
  if (!body) {
    return (
      <aside className="info-panel">
        <h2>天体信息</h2>
        <p>点击任意天体查看详细参数。</p>
      </aside>
    );
  }

  return (
    <aside className="info-panel">
      <h2>{body.name}</h2>
      <p className="info-kind">类型: {kindLabelMap[body.kind]}</p>
      <ul>
        <li>质量(kg): {formatScientific(body.massKg)}</li>
        <li>平均半径(km): {formatMaybe(body.meanRadiusKm, 2)}</li>
        <li>体积(km^3): {formatScientific(volumeKm3(body.meanRadiusKm))}</li>
        <li>自转周期(天): {formatMaybe(body.rotationPeriodDays, 6)}</li>
        <li>半长轴(AU): {formatMaybe(body.semiMajorAxisAu, 6)}</li>
        <li>轨道周期(年): {formatMaybe(body.orbitalPeriodYears, 6)}</li>
        <li>偏心率: {formatMaybe(body.eccentricity, 4)}</li>
        <li>轨道倾角(度): {formatMaybe(body.inclinationDeg, 2)}</li>
      </ul>
    </aside>
  );
}
