import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import FlagIcon from "@material-ui/icons/Flag";
import {
  Backdrop,
  Button,
  Container,
  Fade,
  makeStyles,
  Modal,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AWState } from "../AWContext";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    color: "black",
    borderRadius: 10,
  },
  container: {
    marginLeft: "auto",
    alignItems: "center",
    display: "flex",
    fontFamily: "Poppins",
  },
}));

function CustomGrid(props) {
  const { loading, modelList } = props;
  const classes = useStyles();
  const history = useHistory();

  const [open, setOpen] = useState(false);

  const [flagReason, setFlagReason] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { user, userVotes, userFlaggedModels, setAlert } = AWState();

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

  const handleFlagReason = async (event) => {
    // console.log(flagReasonEl.current);
    console.log(flagReason);
  };

  const handleFlag = async (event, itemObj) => {
    if (!itemObj.isFlagged) {
      // open popup to enter details.
      handleOpen();
    } else {
      const userProfileRef = doc(db, "userProfile", user.uid);
      try {
        await setDoc(
          userProfileRef,
          {
            flaggedModels: userFlaggedModels.filter((it) => !it[itemObj._id]),
          },
          { merge: true }
        );
        setAlert({
          open: true,
          message: `Successfully un flagged!`,
          type: "success",
        });
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      }
      itemObj.isFlagged = !itemObj.isFlagged;
      itemObj.flagReason = "";
    }
  };

  return (
    <>
      <div className={classes.container}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <Container className={classes.containerStyle}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  style={{ fontFamily: "Poppins", marginTop: 15 }}
                >
                  Add reason for flagging model.
                </Typography>
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    style={{
                      marginTop: 15,
                      fontFamily: "Poppins",
                      display: "flex",
                    }}
                    value={flagReason}
                    id="flagReason"
                    label="Set flag reason"
                    variant="outlined"
                    // ref={flagReasonEl}
                    onChange={(e) => setFlagReason(e.target.value)}
                  />
                  <Button
                    className={classes.button}
                    onClick={(e) => handleFlagReason(e)}
                    variant="contained"
                    color="primary"
                    style={{
                      borderRadius: "64px",
                      display: "flex",
                      marginTop: 15,
                      marginLeft: "auto",
                      marginBottom: 15,
                    }}
                  >
                    Flag it !
                  </Button>
                </form>
              </Container>
            </div>
          </Fade>
        </Modal>
      </div>
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
                    <Tooltip
                      title={item.flagReason ? item.flagReason : ""}
                      arrow
                    >
                      <FlagIcon
                        onClick={(e) => handleFlag(e, item)}
                        color={item.isFlagged ? "secondary" : "action"}
                      />
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
    </>
  );
}

export default CustomGrid;
