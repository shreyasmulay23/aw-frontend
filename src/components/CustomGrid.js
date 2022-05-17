import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import FlagIcon from "@material-ui/icons/Flag";
import { Tooltip } from "@material-ui/core";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AWState } from "../AWContext";

function CustomGrid(props) {
  const { loading, modelList } = props;
  const history = useHistory();

  const { user, userVotes, flaggedModels, setAlert } = AWState();

  const handleVote = async (event, itemObj) => {
    itemObj.isVoted = !itemObj.isVoted;
    const userProfileRef = doc(db, "userProfile", user.uid);
    const upVotesRef = doc(db, "upVotes", itemObj._id);
    if (itemObj.isVoted) {
      itemObj.upVotes = itemObj.upVotes + 1;
    } else {
      itemObj.upVotes = itemObj.upVotes !== 0 ? itemObj.upVotes - 1 : 0;
    }
    try {
      await setDoc(
        userProfileRef,
        {
          votes: !itemObj.isVoted
            ? userVotes.filter((vote) => vote !== itemObj?._id)
            : userVotes
            ? [...userVotes, itemObj?._id]
            : [itemObj?._id],
        },
        { merge: true }
      );
      await setDoc(
        upVotesRef,
        {
          votes: itemObj.upVotes,
        },
        { merge: true }
      );
      setAlert({
        open: true,
        message: itemObj.isVoted
          ? `Successfully voted`
          : ` Successfully un voted!`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <Grid container style={{}}>
      {(loading ? Array.from(new Array(5)) : modelList).map((item, index) => (
        <Box
          key={index}
          width={210}
          style={{ marginRight: 4, marginTop: 10, marginBottom: 10 }}
        >
          {item ? (
            <img
              key={item._id}
              style={{ width: 210, height: 200 }}
              src={item.thumbnails.aw_thumbnail}
              alt={item.searchName}
              onClick={() =>
                history.push(`/models/${encodeURIComponent(item.name)}`)
              }
            />
          ) : (
            <Skeleton variant="rect" width={210} height={200} />
          )}

          {item ? (
            <Box pr={2} bgcolor="#eeeeee">
              <Typography
                gutterBottom
                variant="body2"
                style={{ textAlign: "center", fontFamily: "Poppins" }}
              >
                {item.name}
              </Typography>
              <Typography
                style={{ textAlign: "center", fontFamily: "Poppins" }}
                display="block"
                variant="caption"
                color="textSecondary"
              >
                {item.author}
              </Typography>
              <div style={{ marginLeft: 10, display: "flex" }}>
                <span style={{ display: "flex" }}>
                  <ThumbUpAltIcon
                    color={item.isVoted ? "primary" : "action"}
                    onClick={(e) => handleVote(e, item)}
                  />
                  <span style={{ marginLeft: 5 }}>{`${
                    item.upVotes === 0 ? "" : item.upVotes
                  }`}</span>
                </span>
                <span style={{ marginLeft: "auto" }}>
                  <Tooltip title={item.flagReason ? item.flagReason : ""} arrow>
                    <FlagIcon color={item.isFlagged ? "secondary" : "action"} />
                  </Tooltip>
                </span>
              </div>
            </Box>
          ) : (
            <Box pt={0.5}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          )}
        </Box>
      ))}
    </Grid>
  );
}

export default CustomGrid;
