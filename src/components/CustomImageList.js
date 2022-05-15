import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import ReportRoundedIcon from "@material-ui/icons/ReportRounded";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@material-ui/icons/ThumbDownRounded";
import { Button } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {},
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },

  button: {
    marginLeft: 15,
    marginTop: 15,
    width: "5%",
    alignItems: "center",
  },
}));

function CustomImageList({ modelList }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList rowHeight={180} className={classes.imageList}>
        {modelList.map((item) => (
          <ImageListItem
            key={item._id}
            style={{ width: "20%", height: "250px" }}
          >
            <img src={item.thumbnails.aw_thumbnail} alt={item.searchName} />
            <ImageListItemBar
              title={item.name}
              subtitle={<span>{item.author}</span>}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

export default CustomImageList;
