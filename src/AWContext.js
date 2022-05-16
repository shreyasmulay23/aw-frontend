import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";

const Context = createContext();

const AWContext = ({ children }) => {
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (user) {
      const userProfileRef = doc(db, "userProfile", user?.uid);
      var unsubscribe = onSnapshot(userProfileRef, (info) => {
        if (info.exists()) {
          setApiKey(info.data().apiKey);
        } else {
          console.log("No API Key set for currenct user");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

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
        apiKey,
        setApiKey,
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
