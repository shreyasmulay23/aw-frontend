import "./styles.css";

import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Route } from "react-router-dom";
import Modelpage from "./pages/Modelpage";

import { makeStyles } from "@material-ui/core";

function App() {
  const useStyles = makeStyles({
    App: {
      backgroundColor: "white",
      color: "black",
      minHeight: "100vh",
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
    </BrowserRouter>
  );
}

export default App;
