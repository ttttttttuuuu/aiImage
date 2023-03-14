import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../assets";

const useCheckLogin = () => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("token")
  );

  useEffect(() => {
    async function checkLogin() {
      try {
        const req = await axios.post(`${url}/api/v1/auth/checkLogin`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
          },
        });

        const obj = req.data.success;
        if (obj) setAuthenticated(obj);
        else setAuthenticated(false);
      } catch (err) {
        setAuthenticated(false);
      }
    }

    checkLogin();

    return () => {
      setAuthenticated(false);
    };
  }, []);
  return authenticated;
};

export default useCheckLogin;
