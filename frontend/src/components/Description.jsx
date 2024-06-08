import React, { useContext, useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Description = ({ ques }) => {

  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const [likes, setLikes] = useState(ques?.likes);
  const [dislikes, setDislikes] = useState(ques?.dislikes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLikes(ques?.likes);
    setDislikes(ques?.dislikes);
    const userId = localStorage.getItem("userId");
    const likedBy = ques?.likedBy;
    const dislikedBy = ques?.dislikedBy;
    const likedIndex = likedBy && ques?.likedBy.includes(userId);

    if (!likedIndex) setLiked(false);
    else setLiked(true);

    const dislikedIndex = dislikedBy && ques?.dislikedBy.includes(userId);

    if (!dislikedIndex) setDisliked(false);
    else setDisliked(true);
  }, [ques]);

  const handleLike = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!user) {
        toast.error("Login is required to vote");
        setLiked(false);
        return;
      }

      const response = await axios.post(
        `${BackendUrl}/ques/like/${ques.titleslug}`,
        {
          userId: userId,
        }
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setLiked(!liked);
      if (disliked) {
        setDisliked(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleDislike = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!user) {
        toast.error("Login is required to vote");
        setDisliked(false);
        return;
      }

      const response = await axios.post(
        `${BackendUrl}/ques/dislike/${ques.titleslug}`,
        {
          userId: userId,
        }
      );
      setDislikes(response.data.dislikes);
      setLikes(response.data.likes);
      setDisliked(!disliked);
      if (liked) {
        setLiked(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-orange-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col p-4 h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md mb-4 flex-1">
        <h1 className="text-2xl font-bold mb-2">{ques?.title}</h1>
        <div className="text-gray-600 mb-2 flex items-center">
          <span className={`mr-8 ${getLevelColor(ques?.level)}`}>
            {ques?.level}
          </span>
          <div className="flex flex-wrap">
            {ques?.topics.split(",").map((topic, index) => (
              <div
                key={index}
                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full mr-2 mb-2 inline-block"
              >
                {capitalizeWords(topic)}
              </div>
            ))}
          </div>
        </div>
        <div className="text-gray-900 mb-4 w-1/2 flex">
          {" "}
          <pre className=" min-w-[50%]">{ques?.content}</pre>{" "}
        </div>
        <div>
          <button
            onClick={handleLike}
            className={`mr-2 ${
              liked && user ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <FaThumbsUp />
          </button>
          {likes}
          <button
            onClick={handleDislike}
            className={`ml-4 mr-2 ${disliked ? "text-black" : "text-gray-500"}`}
          >
            <FaThumbsDown />
          </button>
          <span>{dislikes}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4 flex-1">
        <h2 className="text-xl font-bold mb-2">Sample Test Cases</h2>
        {ques?.sampleTestcases?.map((example, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">Example {index + 1}</h3>
            <p className="mb-2">
              <strong>Input</strong> <pre>{example.input}</pre>
            </p>
            <p className="mb-2">
              <strong>Output:</strong> {example.output}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <h2 className="text-xl font-bold mb-2">Constraints</h2>
        <pre>{ques?.constraints}</pre>
      </div>
    </div>
  );
};

export default Description;
