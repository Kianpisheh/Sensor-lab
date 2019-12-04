import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const width = 500;
const height = 250;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

const ActVis = props => {
  const mount = useRef(null);
  const [isAnimating, setAnimating] = useState(true);
  let [scene, setScene] = useState(null);
  let [camera, setCamera] = useState(null);
  let [cube, setCube] = useState(null);

  const controls = useRef(null);

  // setup
  useEffect(() => {
    scene = new THREE.Scene();
    setCamera(new THREE.PerspectiveCamera(75, width / height, 0.1, 1000));
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    setCube(new THREE.Mesh(geometry, material));
    return () => {
      cleanup;
    };
  }, []);

  // update
  useEffect(() => {
    let frameId;

    camera.position.z = 4;
    scene.add(cube);
    renderer.setClearColor("#000000");
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // const handleResize = () => {
    //   width = mount.current.clientWidth;
    //   height = mount.current.clientHeight;
    //   renderer.setSize(width, height);
    //   camera.aspect = width / height;
    //   camera.updateProjectionMatrix();
    //   renderScene();
    // };

    const animate = () => {
      // get rotation data
      const data = props.data;

      if (data) {
        let values = data.value;
        if (values) {
          let rotationVec = getSensorData("rot", values);
          var m = new THREE.Matrix4();
          m.set(...rotationVec);
          let quaternion = new THREE.Quaternion();
          quaternion.setFromRotationMatrix(m);
          cube.matrix.makeRotationFromQuaternion(quaternion);
          cube.matrixAutoUpdate = false;
          // let acc = getSensorData("acc");
          // console.log(rotation);
        }
      } else {
      }

      // cube.rotation.x = 45;
      // cube.rotation.y = 45;
      // cube.rotation.z += 10;

      renderScene();
    };

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    mount.current.appendChild(renderer.domElement);
    //window.addEventListener("resize", handleResize);
    start();

    controls.current = { start, stop };

    return () => {
      stop();
      //window.removeEventListener("resize", handleResize);
      mount.current.removeChild(renderer.domElement);

      scene.remove(cube);
      geometry.dispose();
      material.dispose();
    };
  }, [props]);

  useEffect(() => {
    if (isAnimating) {
      controls.current.start();

      controls.current.stop();
    }
  }, [isAnimating]);

  return (
    <div
      className="vis"
      ref={mount}
      onClick={() => setAnimating(!isAnimating)}
    />
  );
};

const getSensorData = (sensorStr, sensorData) => {
  var data = null;
  const sensorList = Object.keys(sensorData);
  sensorList.forEach(sensor => {
    if (sensor.includes(sensorStr)) {
      data = sensorData[sensor];
    }
  });
  return data;
};

export default ActVis;
