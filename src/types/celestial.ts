export type BodyKind = "star" | "planet" | "dwarf" | "satellite";

export interface CelestialBody {
  id: string;
  name: string;
  kind: BodyKind;
  parentId?: string;
  massKg: number;
  meanRadiusKm: number;
  rotationPeriodDays?: number;
  axialTiltDeg?: number;
  semiMajorAxisAu?: number;
  orbitalPeriodYears?: number;
  eccentricity?: number;
  inclinationDeg?: number;
  color: string;
}

export interface AsteroidBeltConfig {
  innerRadiusAu: number;
  outerRadiusAu: number;
  objectCount: number;
}
