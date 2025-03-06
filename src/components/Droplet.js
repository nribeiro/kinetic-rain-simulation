import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { noise } from "@chriscourses/perlin-noise";
import Bauble from "./Bauble";

const wireMaterial = new THREE.MeshLambertMaterial({
  color: "#c0a0a0",
  emissive: "blue",
});

const Droplet = React.forwardRef(
  ({ position, pattern, time, speed, userData, animateColor }, ref) => {
    const dropRef = useRef();
    const wireRef = useRef();
    const targetY = useRef(0);
    const patternRef = useRef(pattern); // Store the current pattern
    const baubleMaterialRef = useRef(
      new THREE.MeshLambertMaterial({
        color: "#c0a0a0", // Original color
        emissive: "blue",
      })
    );
    const originalColorRef = useRef("#c0a0a0"); // Store the original color

    // Update patternRef when the pattern prop changes
    useEffect(() => {
      patternRef.current = pattern;
    }, [pattern]);

    // Reset color to original when animateColor is false
    useEffect(() => {
      if (!animateColor) {
        baubleMaterialRef.current.color.set(originalColorRef.current); // Reset to original color
      }
    }, [animateColor]);

    // Forward the dropRef to the parent
    React.useImperativeHandle(ref, () => dropRef.current);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime() * speed + time;

      // Use patternRef.current to get the latest pattern value
      switch (patternRef.current) {
        case "wave":
          targetY.current = Math.sin(t + position[0] + position[2]) * 4;
          break;
        case "spiral":
          targetY.current =
            Math.sin(t + position[0] + position[2]) *
            Math.cos(t + position[0] + position[2]) *
            3;
          break;
        case "airplane":
          targetY.current =
            Math.sin(t * 2 + position[0]) * Math.cos(t + position[2]) * 2;
          break;
        case "kite":
          targetY.current =
            Math.sin(t + position[0]) * Math.cos(t + position[2]) * 1.5;
          break;
        case "bounce":
          targetY.current =
            Math.abs(Math.sin(t + position[0] + position[2])) * 2;
          break;
        case "noise":
          targetY.current =
            noise(position[0] * 0.5, position[2] * 0.5, t * 0.5) * 4 - 2;
          break;
        case "cascade":
          targetY.current = Math.sin(t + position[2] * 0.5) * 4;
          break;
        case "ripple":
          targetY.current =
            Math.sin(t * 2 + Math.sqrt(position[0] ** 2 + position[2] ** 2)) *
            4;
          break;
        case "staggeredBounce":
          targetY.current =
            Math.abs(Math.sin(t * 2 + (position[0] + position[2]) * 0.2)) * 2;
          break;
        case "warp":
          // Warp animation: rapid oscillation on the Y-axis
          targetY.current = Math.sin(t * 10) * 2; // High-frequency sine wave
          break;
        default:
          targetY.current = 0;
      }

      // Smooth Transition using lerp
      dropRef.current.position.y = THREE.MathUtils.lerp(
        dropRef.current.position.y,
        targetY.current,
        0.1
      );

      // Update wire geometry dynamically
      if (wireRef.current) {
        const wirePath = new THREE.CatmullRomCurve3([
          new THREE.Vector3(position[0], 20, position[2]), // Fixed ceiling position
          new THREE.Vector3(
            position[0],
            dropRef.current.position.y + 0.25,
            position[2]
          ), // Dynamic droplet position
        ]);
        const newGeometry = new THREE.TubeGeometry(wirePath, 1, 0.02, 8, false); // Recreate geometry
        wireRef.current.geometry.dispose(); // Dispose of the old geometry
        wireRef.current.geometry = newGeometry; // Assign the new geometry
      }

      // Animate color if animateColor is true
      if (animateColor) {
        const hue = (Math.sin(t * 0.5) + 1) / 2; // Oscillate between 0 and 1
        baubleMaterialRef.current.color.setHSL(hue, 1, 0.5); // Set HSL color
      }
    });

    return (
      <>
        <mesh
          ref={dropRef}
          position={position}
          scale={[1, 1, 1]}
          userData={userData}
        >
          <Bauble material={baubleMaterialRef.current} scale={0.5} />
        </mesh>
        {/* Wire connecting the droplet to the ceiling */}
        <mesh ref={wireRef} material={wireMaterial}>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(position[0], 20, position[2]), // Fixed ceiling position
                new THREE.Vector3(position[0], 0, position[2]), // Initial droplet position
              ]),
              1, // Number of segments
              0.01, // Thickness of the wire
              8, // Number of radial segments
              false, // Closed curve
            ]}
          />
        </mesh>
      </>
    );
  }
);

export default Droplet;
