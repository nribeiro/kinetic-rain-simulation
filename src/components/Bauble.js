import React from "react";
import * as THREE from "three";

const baubleMaterial = new THREE.MeshLambertMaterial({
  color: "#c0a0a0",
  emissive: "blue",
});

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const Bauble = ({ scale }) => {
  return (
    <mesh
      castShadow
      receiveShadow
      scale={scale}
      geometry={sphereGeometry}
      material={baubleMaterial}
    />
  );
};

export default Bauble;
