import * as THREE from "three";

export interface KeplerResult {
  x: number;
  z: number;
}

// 用牛顿迭代求解开普勒方程: M = E - e * sin(E)
export function solveEccentricAnomaly(meanAnomaly: number, eccentricity: number): number {
  const e = THREE.MathUtils.clamp(eccentricity, 0, 0.99);
  let E = e < 0.8 ? meanAnomaly : Math.PI;

  for (let i = 0; i < 8; i += 1) {
    const f = E - e * Math.sin(E) - meanAnomaly;
    const fp = 1 - e * Math.cos(E);
    E -= f / fp;
  }

  return E;
}

export function keplerPosition(a: number, eccentricity: number, meanAnomaly: number): KeplerResult {
  const e = THREE.MathUtils.clamp(eccentricity, 0, 0.99);
  const E = solveEccentricAnomaly(meanAnomaly, e);
  const b = a * Math.sqrt(1 - e * e);
  const x = a * (Math.cos(E) - e);
  const z = b * Math.sin(E);

  return { x, z };
}

export function orbitalPathPoints(
  a: number,
  eccentricity: number,
  inclinationRad: number,
  parentPosition: THREE.Vector3,
  segments = 220
): Float32Array {
  const e = THREE.MathUtils.clamp(eccentricity, 0, 0.99);
  const b = a * Math.sqrt(1 - e * e);
  const points = new Float32Array(segments * 3);

  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const x = a * (Math.cos(t) - e);
    const zRaw = b * Math.sin(t);
    const y = zRaw * Math.sin(inclinationRad);
    const z = zRaw * Math.cos(inclinationRad);

    points[i * 3] = parentPosition.x + x;
    points[i * 3 + 1] = parentPosition.y + y;
    points[i * 3 + 2] = parentPosition.z + z;
  }

  return points;
}
