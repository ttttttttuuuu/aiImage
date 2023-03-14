import React, { useState, useEffect } from "react";
import { url } from "../assets";
import { Loader, Card } from "../components";
const Me = () => {
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}/api/v1/post`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        // console.log("res", response);
        if (response.ok) {
          const result = await response.json();

          setMyPosts(
            result.data
              .filter((post) => post.user_id === localStorage.getItem("_id"))
              .reverse()
          );
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const RenderCards = ({ data, title }) => {
    if (data.length > 0) {
      return data.map((post) => <Card key={post._id} {...post} />);
    }

    return (
      <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">
        {title}
      </h2>
    );
  };

  return (
    <main className="sm:p-8 px-4   w-full dark:bg-[#252525] dark:text-white min-h-[calc(100vh - 73px)]">
      <section className="max-w-7xl mx-auto">
        <div>
          <h1 className="font-extrabold text-[#222328] dark:text-white  text-[32px]">
            My Post
          </h1>
          <p className="mt-2 text-[#666475] text-[16px] max-w-[500px]">
            Browser through a collection of imaginative and visually stunning
            images generated by DALL-E AI
          </p>
        </div>

        <div className="mt-10 ">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div>
              <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                <RenderCards data={myPosts} title="My Posts" />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Me;