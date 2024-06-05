import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Code from "./Code";
import { AuthContext } from "../context/AuthContext";

const Discussions = () => {
  const [discussion, setDiscussion] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replyBoxes, setReplyBoxes] = useState({});
  const userId = localStorage.getItem("userId");

  const { titleslug } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/ques/${titleslug}/discussions`
        );
        setDiscussion(response.data);
      } catch (error) {
        console.error("Error fetching discussion:", error);
      }
    };

    fetchDiscussion();
  }, [titleslug]);

  const handleAddComment = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!user) {
        toast.error("Please login to comment");
        return;
      }
      const response = await axios.post(
        `http://localhost:5000/ques/${titleslug}/discussions/comment`,
        {
          content: newComment,
          userId: userId,
        }
      );
      setDiscussion(response.data);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!user) {
        toast.error("Please login to reply");
        return;
      }
      const response = await axios.post(
        `http://localhost:5000/ques/${titleslug}/discussions/comment/${commentId}/reply`,
        {
          content: newReply[commentId],
          userId: userId,
        }
      );
      setDiscussion(response.data);
      setNewReply((prevState) => ({ ...prevState, [commentId]: "" }));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      if (!user) {
        toast.error("Login is required");
        return;
      }
      const response = await axios.post(
        `http://localhost:5000/ques/${titleslug}/discussions/${commentId}/like`,
        {
          userId: userId,
        }
      );
      setDiscussion(response.data);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    try {
      if (!user) {
        toast.error("Please login to like");
        return;
      }
      const response = await axios.post(
        `http://localhost:5000/ques/${titleslug}/discussions/${commentId}/${replyId}/like`,
        {
          userId: userId,
        }
      );
      setDiscussion(response.data);
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const toggleReplyBox = (commentId) => {
    try {
      if (!user) {
        toast.error("Login is required");
        return;
      }
      setReplyBoxes((prevState) => ({
        ...prevState,
        [commentId]: !prevState[commentId],
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReplyChange = (e, commentId) => {
    const { value } = e.target;
    setNewReply((prevState) => ({
      ...prevState,
      [commentId]: value,
    }));
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
          🧪Solutions
        </Link>
        <Link className="px-2" to={`/question/${titleslug}/submissions`}>
          ▼ Submissions
        </Link>
        <Link className="px-2" to={`/question/${titleslug}/discuss`}>
          🗨️ Discuss
        </Link>
      </div>
      <div className="flex">
        <div className="w-1/2 overflow-y-auto h-screen p-4">
          <div className="discussion-page">
            <div className="flex flex-col items-end">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type comment here..."
                className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-2"
                required
                style={{ whiteSpace: "pre-wrap" }}
              />
              <button
                onClick={handleAddComment}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Comment
              </button>
            </div>
            <div>
              💡<strong>Discussion Rules</strong>
              <br />
              1. Please don't post <strong>any solutions</strong> in this
              discussion.
              <br /> <br />
              2. The problem discussion is for asking questions about the
              problem or for sharing tips - anything except for solutions.
              <br /> <br />
              3. If you'd like to share your solution for feedback and ideas,
              please head to the solutions tab and post it there.
              <br />
            </div>
            <br />

            {discussion ? (
              <div>
                <div>
                  {discussion.comments.map((comment) => (
                    <div key={comment._id} className="py-4">
                      <p>
                        <Link
                          to={`/profile/${comment.username}`}
                          className=" hover:text-blue-600"
                        >
                          {" "}
                          <strong>{comment.username}</strong>
                        </Link>
                      </p>
                      <p> {comment.content}</p>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          className="mr-2"
                        >
                          <FaThumbsUp
                            className={
                              comment.likes.includes(
                                localStorage.getItem("userId")
                              ) && user !== null
                                ? "text-blue-500"
                                : "text-gray-500"
                            }
                          />
                        </button>
                        <span className="mr-2">{comment.likes.length}</span>
                        {comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(comment._id)}
                            className="px-3"
                          >
                            {showReplies[comment._id]
                              ? `Hide ${comment.replies.length} Replies`
                              : `Show ${comment.replies.length} Replies`}
                          </button>
                        )}
                        <button
                          onClick={() => toggleReplyBox(comment._id)}
                          className="mr-2 flex items-center px-2"
                        >
                          <FaReply className="mr-1" /> reply
                        </button>
                      </div>
                      {replyBoxes[comment._id] && (
                        <div className="flex flex-col items-end">
                          <textarea
                            value={newReply[comment._id] || ""}
                            onChange={(e) => handleReplyChange(e, comment._id)}
                            placeholder="Type reply here..."
                            className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-2"
                            required
                            style={{ whiteSpace: "pre-wrap" }}
                          />
                          <div className="flex flex-row">
                            <button
                              onClick={() => toggleReplyBox(comment._id)}
                              className="px-2"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddReply(comment._id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      )}
                      {showReplies[comment._id] && (
                        <div className="replies">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="reply">
                              <Link
                                to={`/profile/${reply.username}`}
                                className=" hover:text-blue-600"
                              >
                                {reply.username}
                              </Link>
                              <p>{reply.content}</p>
                              <button
                                onClick={() =>
                                  handleLikeReply(comment._id, reply._id)
                                }
                              >
                                <FaThumbsUp
                                  className={
                                    reply.likes.includes(
                                      localStorage.getItem("userId")
                                    ) && user !== null
                                      ? "text-blue-500"
                                      : "text-gray-500"
                                  }
                                />
                              </button>
                              <span>{reply.likes.length}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No discussions yet...</p>
            )}
          </div>
        </div>
        <div className="w-1/2 overflow-y-auto h-screen p-4">
          <Code quesID={titleslug} />
        </div>
      </div>
    </>
  );
};

export default Discussions;
