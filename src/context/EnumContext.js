import { useEffect, useState, createContext } from "react";
import api from "../api/api";

export const EnumContext = createContext();

export const EnumProvider = ({ children }) => {
  const [enums, setEnums] = useState({});

  useEffect(() => {
    api.get("/api/enums/all")
       .then(res => setEnums(res.data))
       .catch(console.error);
  }, []);

  return (
    <EnumContext.Provider value={enums}>
      {children}
    </EnumContext.Provider>
  );
  
}

