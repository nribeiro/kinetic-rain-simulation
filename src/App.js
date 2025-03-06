import React from "react";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import KineticRain from "./components/KineticRain";
import Experience from "./components/Experience";

const App = () => {
  const { pattern, speed, stats, animateColor } = useControls({
    pattern: {
      value: "warp",
      options: [
        "wave",
        "spiral",
        "airplane",
        "kite",
        "bounce",
        "noise",
        "cascade",
        "ripple",
        "staggeredBounce",
        "warp",
      ],
    },
    speed: {
      value: 0.1,
      min: 0,
      max: 2,
      step: 0.1,
    },
    stats: {
      value: true,
    },
    animateColor: {
      value: false, // Toggle for color animation
    },
  });

  return (
    <>
      <Leva />
      <Canvas
        shadows
        style={{ width: "100vw", height: "100vh" }}
        gl={{ alpha: false, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 30, 80], fov: 32.5, near: 1, far: 1000 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
      >
        <Experience stats={stats}>
          <KineticRain
            pattern={pattern}
            speed={speed}
            animateColor={animateColor}
          />
        </Experience>
      </Canvas>
    </>
  );
};

export default App;
