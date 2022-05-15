import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

const Context = createContext();

const AWContext = ({ children }) => {
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  });

  return (
    <Context.Provider
      value={{
        name,
        user,
        setUser,
        alert,
        setAlert,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AWContext;

export const AWState = () => {
  return useContext(Context);
};
