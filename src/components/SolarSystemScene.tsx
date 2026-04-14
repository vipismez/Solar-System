import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { Mesh } from "three";
import { asteroidBelt, celestialBodies } from "../data/celestialData";
import type { CelestialBody } from "../types/celestial";
import { keplerPosition, orbitalPathPoints } from "../utils/orbit";

interface SceneProps {
  showLabels: boolean;
  showOrbits: boolean;
  timeScale: number;
  selfRotationScale: number;
  bodyScale: number;
  sunScale: number;
  orbitScale: number;
  satelliteDensity: number;
  paused: boolean;
  resetSignal: number;
  selectedBodyId: string | null;
  onSelectBody: (id: string | null) => void;
  focusBodyId: string | null;
  focusSignal: number;
}

const AU_TO_UNITS = 28;
const EARTH_RADIUS_KM = 6371.0084;

function radiusToUnits(radiusKm: number, bodyScale: number): number {
  const earthR = radiusKm / EARTH_RADIUS_KM;
  // 保持真实体积比的前提下设置最低可见尺寸，避免小卫星完全不可见。
  return Math.max(earthR * bodyScale * 0.45, 0.08);
}

function orbitalDistanceToUnits(au: number, orbitScale: number): number {
  return au * AU_TO_UNITS * orbitScale;
}

function displayOrbitRadius(
  body: CelestialBody,
  parent: CelestialBody | undefined,
  bodyScale: number,
  orbitScale: number,
  satelliteDensity: number
): number {
  const baseAu = (body.semiMajorAxisAu ?? 0) * (body.kind === "satellite" ? 1.2 / satelliteDensity : 1);
  const physicalA = orbitalDistanceToUnits(baseAu, orbitScale);

  if (body.kind !== "satellite" || !parent) {
    return physicalA;
  }

  const parentRadius = radiusToUnits(parent.meanRadiusKm, bodyScale);
  const satelliteRadius = radiusToUnits(body.meanRadiusKm, bodyScale);

  // 卫星轨道采用“物理值 + 可见下限”混合，避免被母星球体遮挡。
  const minVisibleOrbit = parentRadius + satelliteRadius + 0.18;
  const minOrbitTrack = parentRadius * 1.7 + satelliteRadius * 1.2;
  return Math.max(physicalA * 6, minVisibleOrbit, minOrbitTrack);
}

function OrbitPath({
  a,
  eccentricity,
  inclination,
  parentPosition
}: {
  a: number;
  eccentricity: number;
  inclination: number;
  parentPosition: THREE.Vector3;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const points = orbitalPathPoints(a, eccentricity, inclination, parentPosition);
    g.setAttribute("position", new THREE.BufferAttribute(points, 3));
    return g;
  }, [a, eccentricity, inclination, parentPosition.x, parentPosition.y, parentPosition.z]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="#90a8c4" transparent opacity={0.35} />
    </lineLoop>
  );
}

function OrbitalBody({
  body,
  position,
  bodyScale,
  sunScale,
  sunRadiusCap,
  timeScale,
  selfRotationScale,
  paused,
  showLabels,
  highlighted,
  onSelect
}: {
  body: CelestialBody;
  position: THREE.Vector3;
  bodyScale: number;
  sunScale: number;
  sunRadiusCap: number;
  timeScale: number;
  selfRotationScale: number;
  paused: boolean;
  showLabels: boolean;
  highlighted: boolean;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const isSun = body.id === "sun";

  const rawRadius = radiusToUnits(body.meanRadiusKm, bodyScale) * (isSun ? sunScale : 1);
  const radius = isSun ? Math.min(rawRadius, sunRadiusCap) : rawRadius;

  const effectiveRotationPeriodDays =
    body.rotationPeriodDays ??
    (body.kind === "satellite" && body.orbitalPeriodYears ? body.orbitalPeriodYears * 365.25 : 1);

  useFrame((_, delta) => {
    if (paused || selfRotationScale <= 0) {
      return;
    }

    if (meshRef.current) {
      // rotationPeriodDays < 0 代表逆行自转。
      const sign = effectiveRotationPeriodDays < 0 ? -1 : 1;
      const periodAbs = Math.max(Math.abs(effectiveRotationPeriodDays), 0.01);
      const simulatedDaysDelta = delta * timeScale * 0.08 * 365.25 * selfRotationScale;
      meshRef.current.rotation.y += sign * ((simulatedDaysDelta / periodAbs) * Math.PI * 2);
    }
  });

  return (
    <group position={position} rotation={[0, 0, THREE.MathUtils.degToRad(body.axialTiltDeg ?? 0)]}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(body.id);
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={body.color}
          emissive={isSun || highlighted ? body.color : "#000000"}
          emissiveIntensity={isSun ? 0.65 : highlighted ? 0.35 : 0.0}
          roughness={0.9}
          metalness={0.05}
        />
        {showLabels && (
          <Html distanceFactor={14} center>
            <div className="celestial-label">{body.name}</div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

function AsteroidBelt({ orbitScale }: { orbitScale: number }) {
  const points = useMemo(() => {
    const vectors: number[] = [];
    const inner = orbitalDistanceToUnits(asteroidBelt.innerRadiusAu, orbitScale);
    const outer = orbitalDistanceToUnits(asteroidBelt.outerRadiusAu, orbitScale);

    for (let i = 0; i < asteroidBelt.objectCount; i += 1) {
      const t = Math.random();
      const radius = inner + (outer - inner) * t;
      const theta = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.35;
      vectors.push(radius * Math.cos(theta), height, radius * Math.sin(theta));
    }

    return new Float32Array(vectors);
  }, [orbitScale]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(points, 3));
    return g;
  }, [points]);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#b8c1cf" size={0.06} sizeAttenuation />
    </points>
  );
}

function SceneContent(props: SceneProps) {
  const { camera } = useThree();
  const [time, setTime] = useState(0);
  const simulationTimeRef = useRef(0);
  const uiSyncAccumulatorRef = useRef(0);
  const sun = celestialBodies.find((b) => b.id === "sun") as CelestialBody;
  const nonSunBodies = celestialBodies.filter((b) => b.id !== "sun");

  const bodyMap = useMemo(() => new Map(celestialBodies.map((b) => [b.id, b])), []);
  const mercury = bodyMap.get("mercury");
  const positionMapRef = useRef<Record<string, THREE.Vector3>>({});
  const controlsRef = useRef<any>(null);
  const pendingFocusRef = useRef<string | null>(null);
  const focusElapsedRef = useRef(0);

  // 太阳显示上限：不超过水星近日点轨道半径的 28%，避免内太阳系在缩放时被遮挡。
  const mercuryPerihelionAu = (mercury?.semiMajorAxisAu ?? 0.387) * (1 - (mercury?.eccentricity ?? 0.2056));
  const sunRadiusCap = Math.max(orbitalDistanceToUnits(mercuryPerihelionAu, props.orbitScale) * 0.28, 0.2);

  useEffect(() => {
    // 定位请求是一次性事件：收到请求时开始平滑过渡，完成后自动释放控制。
    pendingFocusRef.current = props.focusBodyId;
    focusElapsedRef.current = 0;
  }, [props.focusBodyId, props.focusSignal]);

  useEffect(() => {
    simulationTimeRef.current = 0;
    uiSyncAccumulatorRef.current = 0;
    setTime(0);
  }, [props.resetSignal]);

  positionMapRef.current = { sun: new THREE.Vector3(0, 0, 0) };

  const resolvePosition = (body: CelestialBody): THREE.Vector3 => {
    const cached = positionMapRef.current[body.id];
    if (cached) {
      return cached;
    }

    if (!body.parentId || body.id === "sun") {
      const origin = new THREE.Vector3(0, 0, 0);
      positionMapRef.current[body.id] = origin;
      return origin;
    }

    const parent = bodyMap.get(body.parentId);
    const parentPosition = parent ? resolvePosition(parent) : new THREE.Vector3(0, 0, 0);
    const orbitalYears = body.orbitalPeriodYears ?? 1;
    const meanAnomaly = ((time / orbitalYears) % 1) * Math.PI * 2;
    const e = body.eccentricity ?? 0;
    const inclination = THREE.MathUtils.degToRad(body.inclinationDeg ?? 0);
    const a = displayOrbitRadius(body, parent, props.bodyScale, props.orbitScale, props.satelliteDensity);
    const local = keplerPosition(a, e, meanAnomaly);

    const y = local.z * Math.sin(inclination);
    const z = local.z * Math.cos(inclination);
    const position = new THREE.Vector3(parentPosition.x + local.x, parentPosition.y + y, parentPosition.z + z);
    positionMapRef.current[body.id] = position;
    return position;
  };

  nonSunBodies.forEach((body) => {
    resolvePosition(body);
  });

  useFrame((_, delta) => {
    if (!props.paused) {
      simulationTimeRef.current += delta * props.timeScale * 0.08;
    }
    uiSyncAccumulatorRef.current += delta;

    const focusId = pendingFocusRef.current;
    if (focusId) {
      focusElapsedRef.current += delta;
      const targetPosition = positionMapRef.current[focusId];
      const targetBody = bodyMap.get(focusId);

      if (targetPosition && targetBody && controlsRef.current) {
        const controls = controlsRef.current;
        const targetRadius = radiusToUnits(targetBody.meanRadiusKm, props.bodyScale);
        const idealDistance = THREE.MathUtils.clamp(targetRadius * 14, 2.5, 120);
        const currentDir = camera.position.clone().sub(controls.target);

        if (currentDir.lengthSq() < 1e-6) {
          currentDir.set(1, 0.35, 1);
        }
        currentDir.normalize();

        const desiredCameraPosition = targetPosition.clone().add(currentDir.multiplyScalar(idealDistance));
        controls.target.lerp(targetPosition, 0.16);
        camera.position.lerp(desiredCameraPosition, 0.16);
        controls.update();

        // 到达阈值或超时后结束自动定位，避免“锁定视角”。
        if (camera.position.distanceTo(desiredCameraPosition) < 0.08 || focusElapsedRef.current > 1.25) {
          pendingFocusRef.current = null;
          focusElapsedRef.current = 0;
        }
      }
    }

    if (uiSyncAccumulatorRef.current >= 1 / 30) {
      setTime(simulationTimeRef.current);
      uiSyncAccumulatorRef.current = 0;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight intensity={2.2} color="#ffd46b" distance={900} />
      <Stars radius={700} depth={80} count={8000} factor={4} saturation={0} fade speed={0.4} />

      <OrbitalBody
        body={sun}
        position={new THREE.Vector3(0, 0, 0)}
        bodyScale={props.bodyScale}
        sunScale={props.sunScale}
        sunRadiusCap={sunRadiusCap}
        timeScale={props.timeScale}
        selfRotationScale={props.selfRotationScale}
        paused={props.paused}
        showLabels={props.showLabels}
        highlighted={props.selectedBodyId === sun.id}
        onSelect={props.onSelectBody}
      />

      {nonSunBodies.map((body) => {
        const position = positionMapRef.current[body.id] ?? new THREE.Vector3();
        const parentPosition = body.parentId
          ? positionMapRef.current[body.parentId] ?? new THREE.Vector3(0, 0, 0)
          : new THREE.Vector3(0, 0, 0);
        const parent = body.parentId ? bodyMap.get(body.parentId) : undefined;
        const a = displayOrbitRadius(body, parent, props.bodyScale, props.orbitScale, props.satelliteDensity);
        const e = body.eccentricity ?? 0;
        const inclination = THREE.MathUtils.degToRad(body.inclinationDeg ?? 0);
        const shouldShowSatellite = body.kind !== "satellite" || props.satelliteDensity >= 0.3;

        if (!shouldShowSatellite) {
          return null;
        }

        return (
          <group key={body.id}>
            {props.showOrbits && a > (body.kind === "satellite" ? 0.01 : 0.06) && (
              <OrbitPath a={a} eccentricity={e} inclination={inclination} parentPosition={parentPosition} />
            )}
            <OrbitalBody
              body={body}
              position={position}
              bodyScale={props.bodyScale}
              sunScale={props.sunScale}
              sunRadiusCap={sunRadiusCap}
              timeScale={props.timeScale}
              selfRotationScale={props.selfRotationScale}
              paused={props.paused}
              showLabels={props.showLabels && (body.kind !== "satellite" || props.satelliteDensity >= 0.7)}
              highlighted={props.selectedBodyId === body.id}
              onSelect={props.onSelectBody}
            />
          </group>
        );
      })}

      <AsteroidBelt orbitScale={props.orbitScale} />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={10}
        maxDistance={3600}
        zoomSpeed={0.9}
        onStart={() => {
          pendingFocusRef.current = null;
          focusElapsedRef.current = 0;
        }}
      />
    </>
  );
}

export function SolarSystemScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 220, 520], fov: 50, near: 0.1, far: 8000 }}
      onPointerMissed={() => props.onSelectBody(null)}
    >
      <color attach="background" args={["#010307"]} />
      <SceneContent {...props} />
    </Canvas>
  );
}
