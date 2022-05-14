import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiContext } from "../config/api";

const Modelpage = () => {
  const { name } = useParams();
  const [decodedName, setDecodedName] = useState(decodeURIComponent(name));
  console.log(decodeURIComponent(name));

  const fetchSingleModel = async () => {
    try {
      const { data } = await axios.get(apiContext.getSingleName(name), {
        headers: { API_KEY: apiContext.API_KEY },
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
