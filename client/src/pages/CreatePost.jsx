import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview, url } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";
import { Navigate } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";
const CreatePost = (props) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [form, setForm] = useState({
    name: username,
    prompt: "",
    photo: "",
    type: "DALL-E",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [state, setState] = useState(true);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const handleSubmit = async (e) => {
    // 確認browser不會自動加載
    e.preventDefault();

    if (!localStorage.getItem("username")) {
      alert("Please login !");
      return;
    }

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const result = await fetch(`${url}/api/v1/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
          },
          body: JSON.stringify(form),
        });
        await result.json();
        navigate("/");
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and  generate image");
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };
  const generateImage = async () => {
    if (!localStorage.getItem("username")) {
      alert("Please login !");
      return;
    }

    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(`${url}/api/v1/dalle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") ?? null}`,
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter prompt");
    }
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadImg = async (e) => {
    const f = e.target.files[0];
    const base64 = await convertBase64(f);
    setFile(URL.createObjectURL(e.target.files[0]));
    setForm({ ...form, photo: base64 });
  };
  console.log(form);
  if (props.state) {
    return (
      <div>
        {/* <Navbar /> */}
        <main className="sm:p-8 px-4   w-full bg-[#f9fafe] min-h-[calc(100vh - 73px)]">
          <section className="max-w-7xl mx-auto">
            <div>
              <h1 className="font-extrabold text-[#222328] text-[32px]">
                Generate AI Image
              </h1>
              <p className="mt-2 text-[#666475] text-[14px] max-w-[500px]">
                Create imaginative and visually stunning images through DALL-E
                AI and share them with the community
              </p>
            </div>
            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <FormField
                  LabelName="Your name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  handleChange={handleChange}
                />
                <div className="mt-5 flex gap-5">
                  <p className="block text-sm font-medium text-gray-900 dark:text-orange-300 mt-3">
                    click me change to
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setState(!state);
                      setForm({ ...form, type: state ? "DALL-E" : "File" });
                    }}
                    className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center flex"
                  >
                    {!state ? " Use DALL-E AI" : " Upload Files"}
                    <FaExchangeAlt className="w-4 h-5 ml-2" />
                  </button>
                </div>
                {state ? (
                  <>
                    <FormField
                      LabelName="Prompt"
                      type="text"
                      name="prompt"
                      placeholder="panda mad scientist mixing sparkling chemicals, digital art'"
                      value={form.prompt}
                      handleChange={handleChange}
                      isSurpriseMe
                      handleSurpriseMe={handleSurpriseMe}
                    />
                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                      {form.photo ? (
                        <img
                          src={form.photo}
                          alt={form.prompt}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-9/12 h-9/12 object-contain opacity-40"
                        ></img>
                      )}
                      {generatingImg && (
                        <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                          <Loader />
                        </div>
                      )}
                    </div>
                    <div className="mt-5 flex gap-5">
                      <button
                        type="button"
                        onClick={generateImage}
                        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      >
                        {generatingImg ? "Generating..." : "Generate"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col">
                    {file ? (
                      <img
                        src={file}
                        alt="photo"
                        className="w-9/12 h-9/12 object-contain "
                      ></img>
                    ) : (
                      <div className="flex  items-center justify-start bg-grey-lighter">
                        <label className="w-64 flex flex-col items-center px-4 py-6  text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-orange-500 text-orange-300">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                          </svg>
                          <span className="mt-2 text-base leading-normal">
                            Select a file
                          </span>
                          <input
                            type="file"
                            inputProps={{
                              accept: "image/*",
                            }}
                            className="hidden"
                            onChange={uploadImg}
                          />
                        </label>
                      </div>
                    )}

                    <FormField
                      LabelName="Prompt"
                      type="text"
                      name="prompt"
                      placeholder="panda mad scientist mixing sparkling chemicals, digital art'"
                      value={form.prompt}
                      handleChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="mt-10">
                <p className="mt-2 text-[#666e75] text-[14px] ">
                  Once you have created the image you want, you can share it
                  with others in th community
                </p>
                <button
                  type="submit"
                  className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  {loading ? "Sharing..." : "Share with the community"}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    );
  } else {
    return <Navigate replace to="/" />;
  }
};

export default CreatePost;
