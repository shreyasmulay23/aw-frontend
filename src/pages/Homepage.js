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
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { errorMessages } from "../utils/errorMessages";
import CachedIcon from "@material-ui/icons/Cached";
import { listHandler } from "../utils/listhandler";

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
      if (data && data.length === 0) {
        setAlert({
          open: true,
          message: errorMessages.NOT_FOUND,
          type: "warning",
        });
        setSearchQuery("");
        setModelList([]);
        return;
      }
      const upVotesData = await getUpVotesOnRender();
      listHandler.updateListWithVotes(data, upVotesData);
      setModelList(data);
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

  const handleClick = async (e) => {
    e.preventDefault();
    await fetchAll(searchQuery);
  };

  const addAPIKeyToDB = async () => {
    const userProfileRef = doc(db, "userProfile", user.uid);
    try {
      await setDoc(userProfileRef, { apiKey: key }, { merge: true });
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

  const getUpVotesOnRender = async () => {
    const upVotesData = [];
    try {
      const querySnapshot = await getDocs(collection(db, "upVotes"));
      querySnapshot.forEach((doc) => {
        let obj = {};
        obj[doc.id] = doc.data().votes ? doc.data().votes : 0;
        upVotesData.push(obj);
      });
    } catch (error) {
      console.log(error);
    }
    return upVotesData;
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
                  onClick={(e) => handleClick(e)}
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
