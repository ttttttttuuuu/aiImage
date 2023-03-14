import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { url, loading } from "../assets";
// import useCheckLogin from "../hooks/useCheckLogin";

const Login = (props) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // check user is login?
  // const [authenticated, setAuthenticated] = useState(false);

  async function fetchLogin() {
    setIsLoading(true);
    if (form.email !== "" && form.password.length >= 8) {
      try {
        const req = await axios.post(`${url}/api/v1/auth`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          },
          email: form.email,
          password: form.password,
        });

        const obj = req.data;

        if (obj.success) {
          props.setState(true);
          // props.onChange({ authenticated: obj.token });
          localStorage.setItem("token", obj.token);
          localStorage.setItem("username", obj.username);
          localStorage.setItem("_id", obj._id);
        } else {
          localStorage.setItem("token", "");

          setAuthenticated(false);
          props.setState(false);
          setErrorMsg(obj.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    if (form.password.length < 8) {
      setErr(true);
    }
    if (form.password.length < 8 && form.email === "") {
      setErr(true);
    }
    setIsLoading(false);
  }

  // useEffect(() => {
  //   async function check() {
  //     const res = await checkLogin();
  //     console.log(res);
  //     setAuthenticated(res);
  //   }
  //   check();
  // }, []);

  useEffect(() => {}, [form, err]);
  if (props.state) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <div className="w-full h-full">
        {/* logo */}
        <div className="w-full flex justify-center mt-10">
          <div className=" w-[32px] h-[32px] ">
            <Link to="/">
              <svg viewBox="140 140 520 520" xmlns="http://www.w3.org/2000/svg">
                <path d="m617.24 354a126.36 126.36 0 0 0 -10.86-103.79 127.8 127.8 0 0 0 -137.65-61.32 126.36 126.36 0 0 0 -95.31-42.49 127.81 127.81 0 0 0 -121.92 88.49 126.4 126.4 0 0 0 -84.5 61.3 127.82 127.82 0 0 0 15.72 149.86 126.36 126.36 0 0 0 10.86 103.79 127.81 127.81 0 0 0 137.65 61.32 126.36 126.36 0 0 0 95.31 42.49 127.81 127.81 0 0 0 121.96-88.54 126.4 126.4 0 0 0 84.5-61.3 127.82 127.82 0 0 0 -15.76-149.81zm-190.66 266.49a94.79 94.79 0 0 1 -60.85-22c.77-.42 2.12-1.16 3-1.7l101-58.34a16.42 16.42 0 0 0 8.3-14.37v-142.39l42.69 24.65a1.52 1.52 0 0 1 .83 1.17v117.92a95.18 95.18 0 0 1 -94.97 95.06zm-204.24-87.23a94.74 94.74 0 0 1 -11.34-63.7c.75.45 2.06 1.25 3 1.79l101 58.34a16.44 16.44 0 0 0 16.59 0l123.31-71.2v49.3a1.53 1.53 0 0 1 -.61 1.31l-102.1 58.95a95.16 95.16 0 0 1 -129.85-34.79zm-26.57-220.49a94.71 94.71 0 0 1 49.48-41.68c0 .87-.05 2.41-.05 3.48v116.68a16.41 16.41 0 0 0 8.29 14.36l123.31 71.19-42.69 24.65a1.53 1.53 0 0 1 -1.44.13l-102.11-59a95.16 95.16 0 0 1 -34.79-129.81zm350.74 81.62-123.31-71.2 42.69-24.64a1.53 1.53 0 0 1 1.44-.13l102.11 58.95a95.08 95.08 0 0 1 -14.69 171.55c0-.88 0-2.42 0-3.49v-116.68a16.4 16.4 0 0 0 -8.24-14.36zm42.49-63.95c-.75-.46-2.06-1.25-3-1.79l-101-58.34a16.46 16.46 0 0 0 -16.59 0l-123.31 71.2v-49.3a1.53 1.53 0 0 1 .61-1.31l102.1-58.9a95.07 95.07 0 0 1 141.19 98.44zm-267.11 87.87-42.7-24.65a1.52 1.52 0 0 1 -.83-1.17v-117.92a95.07 95.07 0 0 1 155.9-73c-.77.42-2.11 1.16-3 1.7l-101 58.34a16.41 16.41 0 0 0 -8.3 14.36zm23.19-50 54.92-31.72 54.92 31.7v63.42l-54.92 31.7-54.92-31.7z"></path>
              </svg>
            </Link>
          </div>
        </div>

        <div className="w-full h-full flex justify-center ">
          <div className="w-[400px] min-h-[540px] py-[40px]">
            {/* title */}
            <header className="w-[400px] h-[136px] py-[40px] px-[24px]  text-center">
              <h1 className="text-3xl font-bold  ">Login your account</h1>
            </header>

            {/* form */}

            <div className="w-[400px] h-[377px] px-[40px] pb-[40px] ">
              <div className="">
                <p className="text-red-500 text-left mb-[12px]">{errorMsg}</p>
                <input
                  className={` w-[320px] h-[52px] flex justify-center border focus:border-blue-500 px-[16px] ${
                    form.email === "" && err && "border-red-500"
                  } text-base rounded `}
                  placeholder="Email address "
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className=" ">
                <input
                  type="password"
                  className={` w-[320px] h-[52px] mt-[12px] flex justify-center border focus:border-blue-500 px-[16px] ${
                    form.email === "" && err && "border-red-500"
                  } text-base rounded `}
                  placeholder="Password "
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
              <p className="text-left text-blue-500 mt-[16px] p-[4px]">
                <Link to="/forgetPassword">Forgot password?</Link>
              </p>
              <div className="w-[320px] h-[52px]  bg-blue-500 mt-[24px]  text-white text-xl rounded">
                <button
                  type="submit"
                  name="action"
                  value="default"
                  className="w-[320px] h-[52px] py-[4px] px-[16px] "
                  onClick={() => {
                    fetchLogin();
                  }}
                >
                  <span className="flex justify-center">
                    <img
                      alt="loading"
                      src={loading}
                      className={`w-[20px] ${!isLoading && "hidden"} `}
                    />
                    Continue
                  </span>
                </button>
              </div>
              <div className="w-[320px] h-[52px]">
                <p className="mt-[16px] text-sm">
                  Don't have an account? {"\n \n"}
                  <Link className=" text-blue-500" to="/signUp">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Login;
