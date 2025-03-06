import React from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

const Experience = ({ children, stats }) => {
  return (
    <>
      {stats && <Perf position="bottom-right" />}
      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <directionalLight position={[0, -15, -0]} intensity={4} color="red" />
      <OrbitControls />
      {/*<Environment preset="city" /> */}
      {children}
    </>
  );
};

export default Experience;
