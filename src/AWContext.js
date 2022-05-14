import { createContext, useContext, useState } from "react";

const Context = createContext();

const AWContext = ({ children }) => {
  const [name, setName] = useState("");

  return (
    <Context.Provider
      value={{
        name
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AWContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
