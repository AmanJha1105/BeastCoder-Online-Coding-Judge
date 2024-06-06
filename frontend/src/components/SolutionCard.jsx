import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaRocketchat, FaThumbsUp } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Code from "./Code";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { HiBeaker } from "react-icons/hi";

const SolutionCard = () => {
  const [replyContent, setReplyContent] = useState("");
  const [sol, setSol] = useState();
  const [replies, setReplies] = useState();
  const [selectedSolution, setSelectedSolution] = useState();

  const { titleslug, solutionID } = useParams();

  const userId = localStorage.getItem("userId");
  const { user } = useContext(AuthContext);

  if (replies)
    replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    const getSolution = async () => {
      const response = await axios.get(
        `http://localhost:5000/ques/solutionfromID/${solutionID}`
      );
      const solution = response.data[0];
      setSol(solution);
      setReplies(solution.replies);
      setSelectedSolution(solution);
    };
    getSolution();
  }, [solutionID]);

  const handleReply = async () => {
    const userId = localStorage.getItem("userId");
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    const username = localStorage.getItem("username");

    try {
      const response = await axios.post(
        `http://localhost:5000/ques/solution/${selectedSolution?._id}/reply`,
        {
          userId,
          username,
          content: replyContent,
        }
      );
      setReplies(response.data.replies);
      setReplyContent("");
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

  const handleLikeReply = async (replyId, index) => {
    const userId = localStorage.getItem("userId");
    if (!user) {
      toast.error("Please login to like ");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/ques/solutions/${selectedSolution?._id}/reply/${replyId}/like`,
        {
          userId,
        }
      );
      const updatedReplies = [...replies];
      updatedReplies[index] = response.data.replies.find(
        (reply) => reply._id === replyId
      );
      const sortedReplies = updatedReplies.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReplies(sortedReplies);
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

  const handleLikeSolution = async () => {
    const userId = localStorage.getItem("userId");
    if (!user) {
      toast.error("Please login to like");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/ques/solution/${selectedSolution?._id}/like`,
        {
          userId,
        }
      );
      setSol(response.data);
    } catch (error) {
      console.error("Error liking solution:", error);
    }
  };

  return (
    <>
      <div className="flex items-center px-4 mt-3">
        <img
          src="https://th.bing.com/th/id/OIP.q0vS1-Y6CkeeDknw8ahLDAHaHa?rs=1&pid=ImgDetMain"
          alt="page icon"
          height={15}
          width={15}
        />
        <Link className="px-2" to={`/question/${titleslug}`}>
          Description
        </Link>
        <Link className="px-2" to={`/question/${titleslug}/solutions`}>
          <div className="flex items-center space-x-1">
            <HiBeaker className="text-blue-500" />
            <span>Solutions</span>
          </div>
        </Link>
        <Link className="px-2" to={`/question/${titleslug}/submissions`}>
          <div className="flex items-center space-x-1">
            <PiClockCounterClockwiseBold className="text-blue-500" />
            <span>Submissions</span>
          </div>
        </Link>
        <Link className="px-2" to={`/question/${titleslug}/discuss`}>
          <div className="flex items-center space-x-1">
            <FaRocketchat className="text-grey-500" />
            <span>Discuss</span>
          </div>
        </Link>
      </div>
      <div className="mt-4 px-2">
        <Link className=" text-blue-500" to ={`/question/${titleslug}/solutions`}>All Solutions</Link>
      </div>
      <div className="flex">
        <div className="w-1/2 p-4 overflow-y-auto h-screen">
          <div className="mt-4 p-4 w-full bg-gray-100 rounded">
            <div className="flex items-center">
              <span className="text-sm">
                <Link
                  to={`/profile/${selectedSolution?.username}`}
                  className="flex items-center whitespace-nowrap hover:underline hover:text-blue-500"
                >
                  <span><strong>{selectedSolution?.username}</strong></span>
                </Link>
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {new Date(selectedSolution?.timeOfPublish).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedSolution?.name}
            </h3>
            <div className="flex text-sm text-gray-700">
              <span className="mr-4">{selectedSolution?.language}</span>
              <span>{selectedSolution?.topics?.join(", ")}</span>
            </div>
            <pre className="bg-white p-4 rounded shadow mb-4">
              <code>{selectedSolution?.code}</code>
            </pre>
            <div className="flex flex-row">
              <button
                onClick={handleLikeSolution}
                className={`flex items-center mr-1 ${
                  sol?.likedBy?.includes(userId) && user !== null
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                <FaThumbsUp />
              </button>
              <span>{sol?.likes}</span>
            </div>
            <div className="py-2">Comments ({replies?.length})</div>
            <div className="flex flex-col items-end">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type comment here..."
                className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-2"
                required
                style={{ whiteSpace: "pre-wrap" }}
              />
              <button
                onClick={handleReply}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Comment
              </button>
            </div>

            {replies?.length > 0 &&
              replies?.map((reply, index) => (
                <div
                  key={reply?._id}
                  className="reply bg-white p-2 mb-2 rounded shadow"
                >
                  <Link
                  to={`/profile/${reply?.username}`}
                  className="flex items-center whitespace-nowrap hover:text-blue-500"
                >
                  <span><strong>{reply?.username}</strong></span>
                </Link>
                  <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                    {reply.content}
                  </pre>
                  <p className="text-sm text-gray-500">
                    {new Date(reply?.createdAt).toLocaleString()}
                  </p>
                  <div className="flex flex-row">
                    <button
                      onClick={() => handleLikeReply(reply._id, index)}
                      className={`flex items-center mr-1 ${
                        reply?.likedBy?.includes(userId) && user !== null
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      <FaThumbsUp />
                    </button>{" "}
                    <span>{reply?.likedBy?.length}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-1/2 overflow-y-auto h-screen p-4">
          <Code quesID={titleslug} />
        </div>
      </div>
    </>
  );
};

export default SolutionCard;
