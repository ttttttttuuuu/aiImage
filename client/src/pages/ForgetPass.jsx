import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { url, loading } from "../assets";
const ForgetPass = () => {
  const [form, setForm] = useState({
    username: "",
    code: "",
    password: "",
    confirm: "",
  });
  const [timeState, setTimeState] = useState({
    time: 60,
    btnDisable: false,
    btnContent: "Send Code",
  });

  // check user is login?
  const [authenticated, setAuthenticated] = useState(null);
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let timeChange;
  let ti = timeState.time;

  const clock = () => {
    if (ti > 0) {
      ti = ti - 1;
      setTimeState({
        time: ti,
        btnContent: ti,
        color: "#E6E6FA",
        btnDisable: true,
      });
    } else {
      clearInterval(timeChange);
      setTimeState({
        time: 60,
        btnContent: "Send Code",
        btnDisable: false,
        color: "gray",
      });
    }
  };

  async function forgetPass() {
    setErr(false);
    setErrorMsg("");
    if (
      form.email !== "" &&
      form.password.length >= 8 &&
      form.code !== "" &&
      form.password === form.confirm
    ) {
      setIsLoading(true);
      const req = await axios.post(`${url}/push_newPassword`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        },
        email: form.email,
        code: form.code,
        password: form.password,
      });

      const obj = req.data;

      if (obj.message) {
        setErr(true);
        setErrorMsg(obj.message);
      }
      if (obj.auth) {
        alert("Successfully!");
        window.location.replace("/");
      }
    }
    if (form.password.length < 8) {
      setErr(true);
    }
    if (form.confirm !== form.password) {
      setErr(true);
      setErrorMsg("Please confirm your password! ");
    }
    if (form.password.length < 8 && form.email === "") {
      setErr(true);
    }
    setIsLoading(false);
  }
  async function getSMS() {
    setErr(false);
    setErrorMsg("");

    setTimeState({ btnContent: "60s", btnDisable: true });
    timeChange = setInterval(clock, 1000);
    setShowPass(true);
    if (form.email !== "") {
      await axios.post(`${url}/sendSMS`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        },
        email: form.email,
      });
    }
  }
  async function checkLogin() {
    try {
      const req = await axios.post(`${url}/checkLogin`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
        },
      });

      const obj = req.data.result;

      setAuthenticated(obj);
    } catch (err) {
      setAuthenticated(false);
    }
  }
  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {}, [form, err, authenticated, timeState, showPass]);
  if (authenticated) {
    return <Navigate replace to="/dashboard" />;
  } else {
    return (
      <div className="w-full h-full">
        {/* logo */}
        <div className="w-full flex justify-center mt-10 ">
          <div className=" w-[32px] h-[32px] ">
            <svg viewBox="140 140 520 520" xmlns="http://www.w3.org/2000/svg">
              <path d="m617.24 354a126.36 126.36 0 0 0 -10.86-103.79 127.8 127.8 0 0 0 -137.65-61.32 126.36 126.36 0 0 0 -95.31-42.49 127.81 127.81 0 0 0 -121.92 88.49 126.4 126.4 0 0 0 -84.5 61.3 127.82 127.82 0 0 0 15.72 149.86 126.36 126.36 0 0 0 10.86 103.79 127.81 127.81 0 0 0 137.65 61.32 126.36 126.36 0 0 0 95.31 42.49 127.81 127.81 0 0 0 121.96-88.54 126.4 126.4 0 0 0 84.5-61.3 127.82 127.82 0 0 0 -15.76-149.81zm-190.66 266.49a94.79 94.79 0 0 1 -60.85-22c.77-.42 2.12-1.16 3-1.7l101-58.34a16.42 16.42 0 0 0 8.3-14.37v-142.39l42.69 24.65a1.52 1.52 0 0 1 .83 1.17v117.92a95.18 95.18 0 0 1 -94.97 95.06zm-204.24-87.23a94.74 94.74 0 0 1 -11.34-63.7c.75.45 2.06 1.25 3 1.79l101 58.34a16.44 16.44 0 0 0 16.59 0l123.31-71.2v49.3a1.53 1.53 0 0 1 -.61 1.31l-102.1 58.95a95.16 95.16 0 0 1 -129.85-34.79zm-26.57-220.49a94.71 94.71 0 0 1 49.48-41.68c0 .87-.05 2.41-.05 3.48v116.68a16.41 16.41 0 0 0 8.29 14.36l123.31 71.19-42.69 24.65a1.53 1.53 0 0 1 -1.44.13l-102.11-59a95.16 95.16 0 0 1 -34.79-129.81zm350.74 81.62-123.31-71.2 42.69-24.64a1.53 1.53 0 0 1 1.44-.13l102.11 58.95a95.08 95.08 0 0 1 -14.69 171.55c0-.88 0-2.42 0-3.49v-116.68a16.4 16.4 0 0 0 -8.24-14.36zm42.49-63.95c-.75-.46-2.06-1.25-3-1.79l-101-58.34a16.46 16.46 0 0 0 -16.59 0l-123.31 71.2v-49.3a1.53 1.53 0 0 1 .61-1.31l102.1-58.9a95.07 95.07 0 0 1 141.19 98.44zm-267.11 87.87-42.7-24.65a1.52 1.52 0 0 1 -.83-1.17v-117.92a95.07 95.07 0 0 1 155.9-73c-.77.42-2.11 1.16-3 1.7l-101 58.34a16.41 16.41 0 0 0 -8.3 14.36zm23.19-50 54.92-31.72 54.92 31.7v63.42l-54.92 31.7-54.92-31.7z"></path>
            </svg>
          </div>
        </div>

        <div className="w-full h-full flex justify-center my-10">
          <div className="w-[400px] min-h-[540px] py-[40px] ">
            {/* title */}
            <header className="w-[400px] h-[188px] pt-[40px] pb-[24px]  px-[40px]">
              <h1 className="text-3xl font-bold my-[24px]">
                Reset your password
              </h1>
              <div className="w-[320px] h-[42px] text-sm text-slate-500 ">
                <p className="text-center inline">
                  Enter your email address and we will send you instructions to
                  reset your password.
                </p>
              </div>
            </header>

            {/* form */}

            <div className="w-[400px] h-[271px] px-[40px] pb-[40px] ">
              {/* email */}
              <p className="text-red-500 text-left mb-[12px]">{errorMsg}</p>
              <div className="">
                <input
                  className={` w-[320px] h-[52px] flex justify-center border focus:border-blue-500 px-[16px] ${
                    form.email === "" && err && "border-red-500"
                  } text-base rounded `}
                  placeholder="Email address"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              {/* code */}
              <div className="">
                <input
                  className={`w-[320px] h-[52px] flex justify-center mt-[12px]  border focus:border-blue-500 ${
                    errorMsg && err && "border-red-500"
                  } px-[16px] text-base rounded`}
                  placeholder="Email Code"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                />
              </div>

              {/* submit get code button */}
              <div
                className={`w-[320px] h-[52px] ${
                  timeState.btnDisable ? "bg-[gray]" : "bg-blue-500"
                } mt-[24px] text-white text-xl rounded`}
              >
                <button
                  className={`w-[320px] h-[52px] py-[4px] px-[16px] ${
                    timeState.btnDisable
                      ? "cursor-not-allowed"
                      : "cursor-pointer "
                  }`}
                  disabled={timeState.btnDisable}
                  onClick={() => getSMS()}
                >
                  {timeState.btnContent}
                </button>
              </div>
              {/* password */}
              {showPass && (
                <>
                  <div className="">
                    <input
                      type="password"
                      className={`w-[320px] h-[52px] flex justify-center mt-[12px]  border focus:border-blue-500 ${
                        form.password.length < 8 && err && "border-red-500"
                      } px-[16px] text-base rounded`}
                      placeholder="New Password "
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* password */}
                  <div className="">
                    <input
                      type="password"
                      className={`w-[320px] h-[52px] flex justify-center mt-[12px]  border focus:border-blue-500 ${
                        form.password !== form.confirm &&
                        err &&
                        "border-red-500"
                      } px-[16px] text-base rounded`}
                      placeholder="Confirm Password "
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          confirm: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* submit button */}
                  <div
                    className={`w-[320px] h-[52px]  bg-blue-500
                     mt-[24px] text-white text-xl rounded`}
                  >
                    <button
                      className={`w-[320px] h-[52px] py-[4px] px-[16px]  `}
                      onClick={() => forgetPass()}
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
                </>
              )}

              <div class="w-[320px] h-[52px] ulp-alternate-action  _alternate-action __s16nu9">
                <p class="mt-[16px] text-sm">
                  <Link class=" text-blue-500" to="/login">
                    Back to Login
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

export default ForgetPass;
