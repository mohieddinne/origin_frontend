import { useEffect } from "react";
import { useLocation } from "react-router-dom";

if (!window.catu) window.catu = {};

function useHistoryLog(props) {
  const location = useLocation();

  useEffect(() => {
    if (!Array.isArray(window.catu.history)) window.catu.history = [];
    window.catu.history.push(location.pathname);
  }, [location]);
}

export default useHistoryLog;
