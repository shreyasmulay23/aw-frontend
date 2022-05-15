import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Container, CircularProgress } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import axios from "axios";
import { apiContext } from "../config/api";
import CustomGrid from "../components/CustomGrid";
import { AWState } from "../AWContext";

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
}));

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelList, setModelList] = useState([]);

  const { user } = AWState();

  const fetchAll = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiContext.searchByNames(query), {
        headers: { API_KEY: apiContext.API_KEY },
      });
      setModelList(data);
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  const handleClick = async () => {
    await fetchAll(searchQuery);
  };
  const classes = useStyles();
  return (
    <>
      <Container className={classes.containerStyle}>
        <Typography
          variant="subtitle2"
          gutterBottom
          style={{ fontFamily: "Poppins" }}
        >
          See what we have available in our supported engines & API. Browse
          through endless possibilities.
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
        </form>
      </Container>

      <Container className={classes.listContainer}>
        <CustomGrid loading={loading} modelList={modelList} />
      </Container>
    </>
  );
};

export default Homepage;
