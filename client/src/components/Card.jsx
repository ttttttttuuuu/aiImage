import React, { useState, useEffect, useCallback } from "react";
import {
  download,
  AiOutlineHeart,
  AiFillHeart,
  save,
  saved,
  url,
} from "../assets";
import { downloadImage } from "../utils";
import millify from "millify";
const Card = ({ _id, name, prompt, photo, count }) => {
  console.log(_id, name);

  const [liked, setLiked] = useState(false);
  const [saved_, setSaved] = useState(false);
  const [array, setArray] = useState([]); //like array
  const [savedArray, setSavedArray] = useState([]); //saved Array
  const [counts, setCounts] = useState(count);
  const [isLoading, setIsLoading] = useState(false);
  console.log(array);
  const handleChangeLiked = async () => {
    if (isLoading === true) return;
    if (!localStorage.getItem("username")) {
      alert("Please login !");
      return;
    }
    setIsLoading(true);
    liked ? setCounts((prev) => prev - 1) : setCounts((prev) => prev + 1);
    setLiked(!liked);

    const controller = new AbortController();
    try {
      const result = await fetch(`${url}/api/v1/post/liked`, {
        signal: controller.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
        },
        body: JSON.stringify({ photo_id: _id }),
      });
      await result.json();
      await handleChangeLikedArray();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangeSaved = async () => {
    if (!localStorage.getItem("username")) {
      alert("Please login !");
      return;
    }
    setSaved(!saved_);
    try {
      const result = await fetch(`${url}/api/v1/post/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
        },
        body: JSON.stringify({ photo_id: _id }),
      });
      await result.json();
      await handleChangeSavedArray();
    } catch (error) {
      alert("System error ,Please reference");
    }
  };

  const handleChangeLikedArray = async () => {
    try {
      const result = await fetch(`${url}/api/v1/post/checkedLiked`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
        },
      });
      const obj = await result.json();
      console.log(obj);
      setArray(obj.data);
      if (obj.data?.includes(_id)) setLiked(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeSavedArray = async () => {
    try {
      const result = await fetch(`${url}/api/v1/post/checkedSaved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
        },
      });
      const obj = await result.json();

      setSavedArray(obj?.data.map((e) => e.photo_id));
    } catch (error) {}
  };
  useEffect(() => {
    handleChangeLikedArray();
    handleChangeSavedArray();
  }, []);

  useEffect(() => {}, [array, counts, savedArray]);

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
      {/* download button */}
      <div className="hidden group-hover:flex flex-col max-h-[94.5%]  absolute top-0  right-0 bg-[#10131f] m-2 p-4 rounded-md ">
        <button
          type="button"
          onClick={() => downloadImage(_id, photo)}
          className="outline-button bg-transparent border-none"
        >
          <img
            className="w-6 h-6 object-contain invert"
            src={download}
            alt="download"
          />
        </button>
      </div>
      {/* Post Image */}
      <img
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />
      {/* Info */}
      <div className="hidden group-hover:flex flex-col max-h-[60.5%]  absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md ">
        <p className="text-white text-md overflow-y-auto prompt">{prompt}</p>
        <div className="mt-5 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-700 text-white text-sm object-cover items-center flex justify-center font-bold">
              {name[0]}
            </div>
            <p className="text-white text-sm">{name}</p>
          </div>
          <div className="flex">
            <div className="flex">
              <button
                type="button"
                onClick={() => handleChangeLiked()}
                className="outline-button bg-transparent border-none  "
              >
                {array?.includes(_id) ? (
                  <AiFillHeart className="w-6 h-6 object-contain invert text-emerald-500  " />
                ) : (
                  <AiOutlineHeart className="w-6 h-6 object-contain invert text-black" />
                )}
              </button>

              <p className="text-white">{counts <= 0 ? "" : millify(counts)}</p>
            </div>
            <button
              type="button"
              onClick={() => handleChangeSaved()}
              className="outline-button bg-transparent border-none mx-2"
            >
              {savedArray?.includes(_id) ? (
                <img
                  className="w-6 h-6 object-contain invert"
                  src={saved}
                  alt="saved"
                />
              ) : (
                <img
                  className="w-6 h-6 object-contain invert z-10"
                  src={save}
                  alt="save"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
