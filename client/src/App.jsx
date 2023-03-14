import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useCheckLogin from "./hooks/useCheckLogin";

import {
  Home,
  CreatePost,
  Login,
  SignUp,
  ForgetPass,
  Me,
  Saved,
} from "./pages";
import { Navbar } from "./components";

const App = () => {
  const [mode, setMode] = useState(true);
  const [state, setState] = useState(localStorage.getItem("token"));

  // check user is login?
  const authenticated = useCheckLogin();

  const handleChange = (e) => {
    console.log(e);
    if (e.mode === true) {
      setMode(true);
    } else {
      setMode(false);
    }
    // setState(e.authenticated);
  };

  useEffect(() => {
    if (localStorage.getItem("mode") === "true") {
      setMode(true);
    } else {
      setMode(false);
    }
    setState(authenticated);
  }, []);

  useEffect(() => {}, [mode, state]);
  return (
    <div className={`${mode ? "light" : "dark"}`}>
      <BrowserRouter>
        <Navbar
          onChange={(value) => handleChange(value)}
          mode={mode}
          state={state}
          setState={(e) => setState(e)}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/MyPost"
            element={<Me setState={(e) => setState(e)} state={state} />}
          />
          <Route
            path="/Saved"
            element={<Saved setState={(e) => setState(e)} state={state} />}
          />
          <Route
            path="/create-post"
            element={<CreatePost setState={(e) => setState(e)} state={state} />}
          />
          <Route
            exact
            path="/login"
            element={<Login setState={(e) => setState(e)} state={state} />}
          />
          <Route
            exact
            path="/signUp"
            element={<SignUp setState={(e) => setState(e)} state={state} />}
          />
          <Route exact path="/forgetPassword" element={<ForgetPass />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
