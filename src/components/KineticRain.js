import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Droplet from "./Droplet"; // Assuming Droplet is in a separate file
import useWebSocket from "../hooks/useWebSocket"; // Custom WebSocket hook

const KineticRain = ({ pattern, speed, animateColor }) => {
  const [gridSize, setGridSize] = useState({ rows: 30, cols: 12 });
  const refs = useRef([]);
  const socket = useWebSocket("ws://your-server-address");

  // Responsive Grid
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const rows = Math.floor(width / 100);
      const cols = rows;
      setGridSize({ rows, cols });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Collect positions of all droplets and send them via WebSocket
  useFrame(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const positions = refs.current
        .filter((ref) => ref !== null)
        .map((ref) => ({
          id: ref.position.toArray().join("-"),
          y: ref.position.y,
        }));
      socket.send(JSON.stringify(positions));
    }
  });

  const spacing = 3;

  return (
    <>
      {Array.from({ length: gridSize.rows * gridSize.cols }).map((_, i) => {
        const x = (i % gridSize.cols) * spacing - (gridSize.cols * spacing) / 2;
        const z =
          Math.floor(i / gridSize.cols) * spacing -
          (gridSize.rows * spacing) / 2;
        const timeOffset = (x + z) * 0.2;
        return (
          <Droplet
            userData={{ id: Math.random() }}
            key={i}
            position={[x, 0, z]}
            pattern={pattern}
            time={timeOffset}
            speed={speed}
            animateColor={animateColor} // Pass animateColor prop
            ref={(ref) => (refs.current[i] = ref)}
          />
        );
      })}
    </>
  );
};

export default KineticRain;
