import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { logo, logoDark, MdOutlineLightMode, MdModeNight } from "../assets";

const Navbar = (props) => {
  // check user is login?

  const handleLogOut = () => {
    window.location.reload("/");
    localStorage.clear();
    props.setState(false);
  };

  return (
    <header className="w-full flex justify-between items-center bg-white dark:bg-[#303030] sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4] dark:border-b-[#131415]  ">
      <Link to="/">
        {props.mode ? (
          <img src={logo} alt="logo" className="w-28 object-contain" />
        ) : (
          <img src={logoDark} alt="logo" className="w-28 object-contain" />
        )}
      </Link>
      <div className="flex ">
        <button
          className="mx-2"
          onClick={() => {
            props.onChange({
              mode: !props.mode,
            });
            localStorage.setItem("mode", !props.mode);
          }}
        >
          {props.mode ? (
            <MdOutlineLightMode className=" w-6 h-6" />
          ) : (
            <MdModeNight className="text-white w-6 h-6" />
          )}
        </button>

        {props.state ? (
          <div className="flex gap-4">
            <Link
              to="/create-post"
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Create
            </Link>
            <div className="rounded-xl group relative light:shadow-card  hover:shadow-cardhover card">
              <div className="w-8 h-8 rounded-full bg-green-700 text-white text-sm object-cover items-center flex justify-center font-bold mt-0.5">
                {localStorage.getItem("username")
                  ? localStorage.getItem("username")[0]
                  : ""}
              </div>
              <div className="hidden group-hover:flex flex-col h-[150px] w-[80px]  absolute top-5   right-0   bg-[#10131f] m-2  rounded-md ">
                <Link
                  to="/MyPost"
                  className="outline-button bg-transparent hover:bg-slate-600  border-none text-white text-xs p-4 text-center rounded-md"
                >
                  Me
                </Link>
                <Link
                  to="/Saved"
                  className="outline-button bg-transparent hover:bg-slate-600  border-none text-white text-xs p-4 text-center rounded-md"
                >
                  Saved
                </Link>
                <button
                  type="button"
                  onClick={() => handleLogOut()}
                  className="outline-button bg-transparent   hover:bg-slate-600 border-none text-red-500 text-xs p-4 rounded-md"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="font-inter font-medium bg-purple-500 text-white px-4 py-2 rounded-md"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
