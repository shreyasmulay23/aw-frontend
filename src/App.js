import "./styles.css";

import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Route } from "react-router-dom";
import Modelpage from "./pages/Modelpage";

import { makeStyles } from "@material-ui/core";
import Alert from "./components/Alert";

function App() {
  const useStyles = makeStyles({
    App: {
      color: "black",
      minHeight: "100vh",
      fontFamily: "Poppins",
      backgroundImage:
        "linear-gradient(315deg,rgba(0,253,255,.48),rgba(255,89,233,.48) 40%,rgba(255,89,233,0) 85%)",
    },
  });

  const classes = useStyles();
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Route path="/" component={Homepage} exact />
        <Route path="/models/:name" component={Modelpage} />
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
