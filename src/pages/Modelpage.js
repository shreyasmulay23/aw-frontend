import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AWState } from "../AWContext";
import { apiContext } from "../config/api";

const Modelpage = () => {
  const { name } = useParams();
  const [decodedName, setDecodedName] = useState(decodeURIComponent(name));
  console.log(decodeURIComponent(name));

  const { apiKey } = AWState();

  const fetchSingleModel = async () => {
    try {
      const { data } = await axios.get(apiContext.getSingleName(name), {
        headers: { API_KEY: apiKey },
      });
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchSingleModel();
  }, []);

  return <div>Model Page {decodeURIComponent(name)}</div>;
};

export default Modelpage;
