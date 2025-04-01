import { useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";

function GetSessions() {
  const { getSession } = useAppContext();
  
    useEffect(() => {
      getSession();
    }, []);
  return null;
}

export default GetSessions;