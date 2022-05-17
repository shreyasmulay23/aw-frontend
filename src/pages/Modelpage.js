import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AWState } from "../AWContext";
import { apiContext } from "../config/api";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useFBX } from "@react-three/drei";
import { Suspense } from "react";
import { Container, Typography } from "@material-ui/core";

const Modelpage = () => {
  const { name } = useParams();
  const [decodedName, setDecodedName] = useState(decodeURIComponent(name));
  const [model, setModel] = useState("");

  const { apiKey } = AWState();
  const fetchSingleModel = async () => {
    try {
      const { data } = await axios.get(apiContext.getSingleName(name), {
        headers: { API_KEY: apiKey },
      });
      setModel(data[0]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchSingleModel();
  }, []);

  const Scene = () => {
    let url = "";
    if (model) {
      url = model["model"].rig.rigged_model_fbx;
    }
    const fbx = useFBX(url);
    return <primitive object={fbx} scale={0.05} />;
  };

  return (
    <div>
      {model ? (
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", width: "50%", paddingLeft: 40 }}>
            <Canvas style={{ height: 400 }}>
              <ambientLight intensity={0.5} />
              <pointLight color="white" intensity={1} position={[10, 10, 10]} />
              <OrbitControls position={[5, 1, 5]} />
              <Suspense fallback={null}>
                <Environment preset="city" background={true} />
              </Suspense>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>
          <Container style={{ width: "50%" }}>
            <span style={{ marginLeft: 40 }}>
              <Typography
                variant="h4"
                gutterBottom
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                  marginBottom: 20,
                  display: "flex",
                }}
              >
                {model.name}
              </Typography>
              <hr />
              <Typography
                variant="h5"
                gutterBottom
                style={{ fontFamily: "Poppins", display: "flex" }}
              >
                {model.author}
              </Typography>
            </span>
          </Container>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Modelpage;
