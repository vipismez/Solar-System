import type { AsteroidBeltConfig, CelestialBody } from "../types/celestial";

// 主要参数来源：JPL Solar System Dynamics (Planetary Physical Parameters / Satellite Physical Parameters)
export const celestialBodies: CelestialBody[] = [
  {
    id: "sun",
    name: "太阳",
    kind: "star",
    massKg: 1.9885e30,
    meanRadiusKm: 695700,
    rotationPeriodDays: 25.05,
    axialTiltDeg: 7.25,
    color: "#ffd46b"
  },
  {
    id: "mercury",
    name: "水星",
    kind: "planet",
    parentId: "sun",
    massKg: 3.30103e23,
    meanRadiusKm: 2439.4,
    rotationPeriodDays: 58.6462,
    axialTiltDeg: 0.034,
    semiMajorAxisAu: 0.387,
    orbitalPeriodYears: 0.2408467,
    eccentricity: 0.2056,
    inclinationDeg: 7.0,
    color: "#c2b9a5"
  },
  {
    id: "venus",
    name: "金星",
    kind: "planet",
    parentId: "sun",
    massKg: 4.86731e24,
    meanRadiusKm: 6051.8,
    rotationPeriodDays: -243.018,
    axialTiltDeg: 177.36,
    semiMajorAxisAu: 0.723,
    orbitalPeriodYears: 0.61519726,
    eccentricity: 0.0067,
    inclinationDeg: 3.4,
    color: "#f3c47a"
  },
  {
    id: "earth",
    name: "地球",
    kind: "planet",
    parentId: "sun",
    massKg: 5.97217e24,
    meanRadiusKm: 6371.0084,
    rotationPeriodDays: 0.99726968,
    axialTiltDeg: 23.44,
    semiMajorAxisAu: 1,
    orbitalPeriodYears: 1.0000174,
    eccentricity: 0.0167,
    inclinationDeg: 0,
    color: "#63a8ff"
  },
  {
    id: "mars",
    name: "火星",
    kind: "planet",
    parentId: "sun",
    massKg: 6.41691e23,
    meanRadiusKm: 3389.5,
    rotationPeriodDays: 1.02595676,
    axialTiltDeg: 25.19,
    semiMajorAxisAu: 1.524,
    orbitalPeriodYears: 1.8808476,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    color: "#d07a4b"
  },
  {
    id: "jupiter",
    name: "木星",
    kind: "planet",
    parentId: "sun",
    massKg: 1.898125e27,
    meanRadiusKm: 69911,
    rotationPeriodDays: 0.41354,
    axialTiltDeg: 3.13,
    semiMajorAxisAu: 5.203,
    orbitalPeriodYears: 11.862615,
    eccentricity: 0.0489,
    inclinationDeg: 1.3,
    color: "#d3ab82"
  },
  {
    id: "saturn",
    name: "土星",
    kind: "planet",
    parentId: "sun",
    massKg: 5.68317e26,
    meanRadiusKm: 58232,
    rotationPeriodDays: 0.44401,
    axialTiltDeg: 26.73,
    semiMajorAxisAu: 9.537,
    orbitalPeriodYears: 29.447498,
    eccentricity: 0.0565,
    inclinationDeg: 2.49,
    color: "#e5c074"
  },
  {
    id: "uranus",
    name: "天王星",
    kind: "planet",
    parentId: "sun",
    massKg: 8.68099e25,
    meanRadiusKm: 25362,
    rotationPeriodDays: -0.71833,
    axialTiltDeg: 97.77,
    semiMajorAxisAu: 19.191,
    orbitalPeriodYears: 84.016846,
    eccentricity: 0.0457,
    inclinationDeg: 0.77,
    color: "#88e5ea"
  },
  {
    id: "neptune",
    name: "海王星",
    kind: "planet",
    parentId: "sun",
    massKg: 1.024092e26,
    meanRadiusKm: 24622,
    rotationPeriodDays: 0.67125,
    axialTiltDeg: 28.32,
    semiMajorAxisAu: 30.069,
    orbitalPeriodYears: 164.79132,
    eccentricity: 0.0113,
    inclinationDeg: 1.77,
    color: "#5372ff"
  },
  {
    id: "pluto",
    name: "冥王星",
    kind: "dwarf",
    parentId: "sun",
    massKg: 1.30246e22,
    meanRadiusKm: 1188.3,
    rotationPeriodDays: -6.3872,
    axialTiltDeg: 119.5,
    semiMajorAxisAu: 39.482,
    orbitalPeriodYears: 247.92065,
    eccentricity: 0.2488,
    inclinationDeg: 17.16,
    color: "#ceb8ab"
  },

  // 地球卫星
  {
    id: "moon",
    name: "月球",
    kind: "satellite",
    parentId: "earth",
    massKg: 7.34767309e22,
    meanRadiusKm: 1737.4,
    semiMajorAxisAu: 0.00257,
    orbitalPeriodYears: 0.0748,
    inclinationDeg: 5.1,
    color: "#d5d9df"
  },

  // 火星卫星
  {
    id: "phobos",
    name: "火卫一",
    kind: "satellite",
    parentId: "mars",
    massKg: 1.0659e16,
    meanRadiusKm: 11.08,
    semiMajorAxisAu: 0.0000627,
    orbitalPeriodYears: 0.000873,
    color: "#9a8f80"
  },
  {
    id: "deimos",
    name: "火卫二",
    kind: "satellite",
    parentId: "mars",
    massKg: 1.4762e15,
    meanRadiusKm: 6.2,
    semiMajorAxisAu: 0.0001567,
    orbitalPeriodYears: 0.00346,
    color: "#a79a86"
  },

  // 木星主要卫星（可继续扩展到全量）
  {
    id: "io",
    name: "木卫一",
    kind: "satellite",
    parentId: "jupiter",
    massKg: 8.9319e22,
    meanRadiusKm: 1821.49,
    semiMajorAxisAu: 0.00282,
    orbitalPeriodYears: 0.00484,
    color: "#f1d076"
  },
  {
    id: "europa",
    name: "木卫二",
    kind: "satellite",
    parentId: "jupiter",
    massKg: 4.7998e22,
    meanRadiusKm: 1560.8,
    semiMajorAxisAu: 0.00449,
    orbitalPeriodYears: 0.00972,
    color: "#e2e8f6"
  },
  {
    id: "ganymede",
    name: "木卫三",
    kind: "satellite",
    parentId: "jupiter",
    massKg: 1.4819e23,
    meanRadiusKm: 2631.2,
    semiMajorAxisAu: 0.00716,
    orbitalPeriodYears: 0.0196,
    color: "#a9a39e"
  },
  {
    id: "callisto",
    name: "木卫四",
    kind: "satellite",
    parentId: "jupiter",
    massKg: 1.0759e23,
    meanRadiusKm: 2410.3,
    semiMajorAxisAu: 0.0126,
    orbitalPeriodYears: 0.0457,
    color: "#8f8d86"
  },

  // 土星主要卫星
  {
    id: "titan",
    name: "土卫六",
    kind: "satellite",
    parentId: "saturn",
    massKg: 1.3452e23,
    meanRadiusKm: 2574.7,
    semiMajorAxisAu: 0.00817,
    orbitalPeriodYears: 0.0437,
    color: "#d8ad69"
  },
  {
    id: "enceladus",
    name: "土卫二",
    kind: "satellite",
    parentId: "saturn",
    massKg: 1.08022e20,
    meanRadiusKm: 252.1,
    semiMajorAxisAu: 0.00159,
    orbitalPeriodYears: 0.00376,
    color: "#e6edf7"
  },
  {
    id: "iapetus",
    name: "土卫八",
    kind: "satellite",
    parentId: "saturn",
    massKg: 1.8056e21,
    meanRadiusKm: 734.5,
    semiMajorAxisAu: 0.0238,
    orbitalPeriodYears: 0.216,
    color: "#bcb4a6"
  },

  // 天王星主要卫星
  {
    id: "titania",
    name: "天卫三",
    kind: "satellite",
    parentId: "uranus",
    massKg: 3.527e21,
    meanRadiusKm: 788.4,
    semiMajorAxisAu: 0.00291,
    orbitalPeriodYears: 0.0239,
    color: "#b9c6d6"
  },
  {
    id: "oberon",
    name: "天卫四",
    kind: "satellite",
    parentId: "uranus",
    massKg: 3.014e21,
    meanRadiusKm: 761.4,
    semiMajorAxisAu: 0.0039,
    orbitalPeriodYears: 0.0372,
    color: "#aab2c1"
  },

  // 海王星主要卫星
  {
    id: "triton",
    name: "海卫一",
    kind: "satellite",
    parentId: "neptune",
    massKg: 2.139e22,
    meanRadiusKm: 1353.4,
    semiMajorAxisAu: 0.00237,
    orbitalPeriodYears: 0.0161,
    color: "#d8e1ea"
  },

  // 冥王星卫星
  {
    id: "charon",
    name: "冥卫一",
    kind: "satellite",
    parentId: "pluto",
    massKg: 1.586e21,
    meanRadiusKm: 606,
    semiMajorAxisAu: 0.000117,
    orbitalPeriodYears: 0.0176,
    color: "#b7ac9f"
  },
  {
    id: "nix",
    name: "冥卫二",
    kind: "satellite",
    parentId: "pluto",
    massKg: 4.5e16,
    meanRadiusKm: 24.8,
    semiMajorAxisAu: 0.000325,
    orbitalPeriodYears: 0.068,
    color: "#999796"
  },
  {
    id: "hydra",
    name: "冥卫三",
    kind: "satellite",
    parentId: "pluto",
    massKg: 4.8e16,
    meanRadiusKm: 30.5,
    semiMajorAxisAu: 0.000433,
    orbitalPeriodYears: 0.104,
    color: "#9e9d9a"
  },
  {
    id: "kerberos",
    name: "冥卫四",
    kind: "satellite",
    parentId: "pluto",
    massKg: 1e16,
    meanRadiusKm: 14,
    semiMajorAxisAu: 0.000395,
    orbitalPeriodYears: 0.088,
    color: "#8a8885"
  },
  {
    id: "styx",
    name: "冥卫五",
    kind: "satellite",
    parentId: "pluto",
    massKg: 7.5e15,
    meanRadiusKm: 8,
    semiMajorAxisAu: 0.000284,
    orbitalPeriodYears: 0.056,
    color: "#8d8b89"
  }
];

export const asteroidBelt: AsteroidBeltConfig = {
  innerRadiusAu: 2.1,
  outerRadiusAu: 3.3,
  objectCount: 2600
};
