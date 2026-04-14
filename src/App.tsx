import { button, Leva, useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";
import { BodyInfoPanel } from "./components/BodyInfoPanel";
import { SolarSystemScene } from "./components/SolarSystemScene";
import { celestialBodies } from "./data/celestialData";

function App() {
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [focusBodyId, setFocusBodyId] = useState<string | null>("earth");
  const [focusSignal, setFocusSignal] = useState(0);
  const focusBodyIdRef = useRef<string | null>("earth");

  useEffect(() => {
    focusBodyIdRef.current = focusBodyId;
  }, [focusBodyId]);

  // 为“上一个/下一个”构建稳定顺序，避免每次渲染顺序漂移。
  const orderedBodies = useMemo(() => {
    const kindOrder: Record<string, number> = {
      star: 0,
      planet: 1,
      dwarf: 2,
      satellite: 3
    };

    return [...celestialBodies].sort((a, b) => {
      const k = kindOrder[a.kind] - kindOrder[b.kind];
      if (k !== 0) {
        return k;
      }
      return a.name.localeCompare(b.name, "zh-CN");
    });
  }, []);

  const bodyOptions = useMemo(
    () => Object.fromEntries(orderedBodies.map((body) => [body.name, body.id])),
    [orderedBodies]
  );

  // 每次触发定位都递增 focusSignal，驱动场景执行一次性相机跳转。
  const triggerFocus = (id: string) => {
    setFocusBodyId(id);
    setSelectedBodyId(id);
    setFocusSignal((prev) => prev + 1);
  };

  // 使用 ref 读取最新焦点，规避 Leva button 回调闭包滞后。
  const stepFocus = (step: -1 | 1) => {
    const currentId = focusBodyIdRef.current ?? "earth";
    const currentIndex = orderedBodies.findIndex((body) => body.id === currentId);
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (baseIndex + step + orderedBodies.length) % orderedBodies.length;
    triggerFocus(orderedBodies[nextIndex].id);
  };

  const controls = useControls("显示与时间", {
    showLabels: { value: true, label: "显示标签" },
    showOrbits: { value: true, label: "显示轨道" },
    paused: { value: false, label: "暂停" },
    timeScale: { value: 1, min: -50, max: 50, step: 0.1, label: "时间倍率" },
    selfRotationScale: { value: 1, min: 0, max: 30, step: 0.1, label: "自转倍率" },
    重置时间: button(() => setResetSignal((prev) => prev + 1)),
    bodyScale: { value: 1, min: 0.2, max: 5, step: 0.1, label: "天体尺寸" },
    sunScale: { value: 0.035, min: 0.01, max: 0.2, step: 0.005, label: "太阳显示倍率" },
    orbitScale: { value: 1, min: 0.2, max: 3, step: 0.05, label: "轨道缩放" },
    satelliteDensity: { value: 1, min: 0.2, max: 1, step: 0.1, label: "卫星显示密度" }
  });

  useControls("快速定位", {
    targetBodyId: {
      value: "earth",
      options: bodyOptions,
      label: "目标天体",
      onChange: (value) => setFocusBodyId(String(value))
    },
    定位到目标: button(() => {
      triggerFocus(focusBodyId ?? "earth");
    }),
    上一个天体: button(() => {
      stepFocus(-1);
    }),
    下一个天体: button(() => {
      stepFocus(1);
    })
  });

  const selectedBody = useMemo(
    () => celestialBodies.find((body) => body.id === selectedBodyId) ?? null,
    [selectedBodyId]
  );

  return (
    <div className="app-shell">
      <header className="title-bar">
        <h1>太阳系动态 3D 展示系统</h1>
        <p>真实体积比例建模（半径比）+ 轨道独立缩放</p>
      </header>
      <SolarSystemScene
        showLabels={controls.showLabels}
        showOrbits={controls.showOrbits}
        timeScale={controls.timeScale}
        selfRotationScale={controls.selfRotationScale}
        bodyScale={controls.bodyScale}
        sunScale={controls.sunScale}
        orbitScale={controls.orbitScale}
        satelliteDensity={controls.satelliteDensity}
        paused={controls.paused}
        resetSignal={resetSignal}
        selectedBodyId={selectedBodyId}
        onSelectBody={setSelectedBodyId}
        focusBodyId={focusBodyId}
        focusSignal={focusSignal}
      />
      <BodyInfoPanel body={selectedBody} />
      <Leva collapsed={false} />
    </div>
  );
}

export default App;
