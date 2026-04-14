import { button, Leva, useControls } from "leva";
import { useMemo, useState } from "react";
import { BodyInfoPanel } from "./components/BodyInfoPanel";
import { SolarSystemScene } from "./components/SolarSystemScene";
import { celestialBodies } from "./data/celestialData";

function App() {
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  const controls = useControls("显示与时间", {
    showLabels: true,
    showOrbits: true,
    paused: false,
    timeScale: { value: 1, min: -50, max: 50, step: 0.1 },
    resetTime: button(() => setResetSignal((prev) => prev + 1)),
    bodyScale: { value: 1, min: 0.2, max: 5, step: 0.1 },
    orbitScale: { value: 1, min: 0.2, max: 3, step: 0.05 },
    satelliteDensity: { value: 1, min: 0.2, max: 1, step: 0.1 }
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
        bodyScale={controls.bodyScale}
        orbitScale={controls.orbitScale}
        satelliteDensity={controls.satelliteDensity}
        paused={controls.paused}
        resetSignal={resetSignal}
        selectedBodyId={selectedBodyId}
        onSelectBody={setSelectedBodyId}
      />
      <BodyInfoPanel body={selectedBody} />
      <Leva collapsed={false} />
    </div>
  );
}

export default App;
