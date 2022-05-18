import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Avatar, Button } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { AWState } from "../../AWContext";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Poppins",
    backgroundImage:
      "radial-gradient(circle farthest-corner at 0 30%,rgba(0,255,77,.24),rgba(0,255,209,.24) 50%,rgba(0,255,209,.24));",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    marginTop: 20,
    borderRadius: "64px",
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundImage: "linear-gradient(0deg,#00ffd1,#00ff4d)",
    objectFit: "contain",
    color: "black",
  },
  divContainer: {
    marginLeft: "auto",
    alignItems: "center",
    display: "flex",
    fontFamily: "Poppins",
  },
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, apiKey, setApiKey } = AWState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull !",
    });
    setApiKey("");
    toggleDrawer();
  };

  return (
    <div className={classes.divContainer}>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundImage: "linear-gradient(0deg,#00ffd1,#00ff4d)",
              color: "black",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <span
                  style={{
                    width: "100%",
                    fontSize: 15,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  API Key: {apiKey}
                </span>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
                startIcon={<ExitToAppIcon />}
                color="secondary"
                style={{ backgroundColor: "red" }}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
