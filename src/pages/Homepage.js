import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Container } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import axios from "axios";
import { apiContext } from "../config/api";
import CustomGrid from "../components/CustomGrid";
import { AWState } from "../AWContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { errorMessages } from "../utils/errorMessages";
import CachedIcon from "@material-ui/icons/Cached";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      width: "50ch",
    },
  },
  containerStyle: {
    marginTop: 15,
  },
  button: {
    marginLeft: 15,
    marginTop: 15,
    width: "5%",
    alignItems: "center",
  },
  listContainer: {
    marginTop: 15,
    width: "100%",
  },
  list: {
    display: "flex",
    float: "left",
    marginLeft: 15,
    marginRight: 15,
  },
  apiSetKeyBtn: {
    marginLeft: 15,
    marginTop: 15,
    width: "12%",
    alignItems: "center",
  },
  cacheBtn: {
    marginLeft: 15,
    marginTop: 15,
    width: "5%",
    alignItems: "center",
    display: "none",
  },
}));

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelList, setModelList] = useState([]);
  const [key, setKey] = useState("");

  const { user, apiKey, setApiKey, setAlert } = AWState();

  const fetchAll = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiContext.searchByNames(query), {
        headers: { API_KEY: apiKey },
      });
      setModelList(data);
      if (data && data.length === 0) {
        setAlert({
          open: true,
          message: errorMessages.NOT_FOUND,
          type: "warning",
        });
        setSearchQuery("");
      }
    } catch (error) {
      if (error.message === "Request failed with status code 404") {
        setAlert({
          open: true,
          message: errorMessages.NOT_FOUND,
          type: "warning",
        });
        setSearchQuery("");
      }
    }
    setLoading(false);
  };

  const handleClick = async () => {
    await fetchAll(searchQuery);
  };

  const addAPIKeyToDB = async () => {
    const apiKeyDBRef = doc(db, "apiKey", user.uid);
    try {
      await setDoc(apiKeyDBRef, { apiKey: key }, { merge: true });
      setAlert({
        open: true,
        message: `API_KEY ${key} successfully added. You can use the app now. !`,
        type: "success",
      });
      setApiKey(key);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const clearCache = async () => {
    try {
      await axios.get(apiContext.clearCache);
      setAlert({
        open: true,
        message: `Cache Cleared Successfully.`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Error in clearing cache.",
        type: "error",
      });
    }
  };

  const classes = useStyles();
  return (
    <>
      {user ? (
        apiKey ? (
          <>
            <Container className={classes.containerStyle}>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{ fontFamily: "Poppins" }}
              >
                See what we have available in our supported engines & API.
                Browse through endless possibilities.
              </Typography>
              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  style={{ marginTop: 15, fontFamily: "Poppins" }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  id="modelSearch"
                  label="Search 3D Model"
                  variant="outlined"
                />
                <Button
                  className={classes.button}
                  onClick={() => handleClick()}
                  variant="contained"
                  color="primary"
                  startIcon={<SearchOutlined />}
                  style={{ borderRadius: "64px" }}
                ></Button>
                <Button
                  className={classes.cacheBtn}
                  onClick={() => clearCache()}
                  variant="contained"
                  color="primary"
                  startIcon={<CachedIcon />}
                  style={{ borderRadius: "64px" }}
                ></Button>
              </form>
            </Container>

            <Container className={classes.listContainer}>
              <CustomGrid loading={loading} modelList={modelList} />
            </Container>
          </>
        ) : (
          <Container className={classes.containerStyle}>
            <Typography
              variant="subtitle2"
              gutterBottom
              style={{ fontFamily: "Poppins" }}
            >
              Kindly set API KEY to start using APP :
            </Typography>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                style={{ marginTop: 15, fontFamily: "Poppins" }}
                onChange={(e) => setKey(e.target.value)}
                value={key}
                label="Enter API Key"
                variant="outlined"
              />
              <Button
                className={classes.apiSetKeyBtn}
                onClick={() => addAPIKeyToDB(key)}
                variant="contained"
                color="primary"
                style={{ borderRadius: "64px" }}
              >
                Submit API Key
              </Button>
            </form>
          </Container>
        )
      ) : (
        ""
      )}
    </>
  );
};

export default Homepage;
