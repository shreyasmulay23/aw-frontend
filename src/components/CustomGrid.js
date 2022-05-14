import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { useHistory } from "react-router-dom";

function CustomGrid(props) {
  const { loading, modelList } = props;
  const history = useHistory();

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
