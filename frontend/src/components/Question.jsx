import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleHalfStroke } from "react-icons/fa6";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "../context/AuthContext";

const Question = () => {
  const [queslist, setqueslist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const { user } = useContext(AuthContext);

  const topics = [
    { label: "BFS", value: "BFS" },
    { label: "DFS", value: "DFS" },
    { label: "Graph", value: "Graph" },
    { label: "Queue", value: "queue" },
    { label: "Arrays", value: "arrays" },
    { label: "Mathematics", value: "math" },
    { label: "Dynamic Programming", value: "Dynamic Programming" },
    { label: "Stacks", value: "stacks" },
    { label: "String", value: "string" },
    { label: "Matrix", value: "matrix" },
    { label: "Backtracking", value: "backtracking" },
    { label: "Linked List", value: "linkedlist" },
    { label: "Heaps", value: "heap" },
    { label: "Tree", value: "tree" },
    { label: "BST", value: "bst" },
    { label: "Tree", value: "tree" },
    { label: "Binary Tree", value: "bt" },
    { label: "Greedy", value: "greedy" },
    { label: "Sorting", value: "sorting" },
    { label: "Recursion", value: "recursion" },
    { label: "Hash Table", value: "hashtable" },
  ];

  const fetchSubmissions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        "http://localhost:5000/ques/allsubmissions",
        {
          params: {
            userId: userId,
          },
        },
        { withCredentials: true }
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  const handleTopicChange = (selectedOptions) => {
    setSelectedTopics(selectedOptions || []);
  };

  const filteredQuestions = queslist.filter(
    (ques) =>
      ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
      (selectedTopics.length === 0 ||
        selectedTopics.every((topic) => ques.topics.includes(topic.value)))
  );

  const getQuestions = async () => {
    const res = await axios
      .get("http://localhost:5000/ques/allquestion", {
        withCredentials: true,
      })
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleQuestionClick = (quesId) => {
    setSelectedQuestion(quesId === selectedQuestion ? null : quesId);
  };

  const getStatusIcon = (questionId) => {
    if (!user) return null;
    const userSubmissions = submissions.filter(
      (submission) => submission.quesID === questionId
    );
    const isSolved = userSubmissions.some(
      (submission) => submission.verdict === "AC"
    );
    const isAttempted = userSubmissions.length > 0;

    if (isSolved)
      return <FaCheckCircle className="text-green-500 ml-2" title="Solved" />;
    if (isAttempted)
      return (
        <FaCircleHalfStroke
          className="text-orange-500 ml-2"
          title="Attempted"
        />
      );
    return null;
  };

  useEffect(() => {
    getQuestions().then((data) => setqueslist(data));
    fetchSubmissions();
  }, []);

  const formatTopics = (topics) => {
    return topics.split(',').map((topic) => {
      const formattedTopic = topic.trim().charAt(0).toUpperCase() + topic.trim().slice(1);
      return (
        <span key={formattedTopic} className=" bg-orange-300 text-black rounded-full px-2 py-1 mr-2 text-xs">
          <strong>{formattedTopic}</strong>
        </span>
      );
    });
  };

  return (
    <div className="bg-[url('https://wallpaperboat.com/wp-content/uploads/2019/10/coding-25.jpg')] bg-cover bg-center min-h-screen">
      <div className="bg-opacity-50 bg-gray-900 min-h-screen p-5">
        <div className="flex justify-center items-center mb-5">
          {/* Add Questions button */}
          {localStorage.getItem("username") === "aryan" && (
            <Link to="/add">
              <button className="border-2 border-black bg-pink-200 text-purple-950 rounded-lg p-1.5 m-2">
                {" "}
                Add Questions{" "}
              </button>
            </Link>
          )}

          {/* Search input field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by question name..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-black rounded-lg focus:outline-none focus:border-indigo-500 w-72"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <HiSearch />
            </div>
          </div>

          <div className="ml-4 w-72">
            <Select
              isMulti
              options={topics}
              value={selectedTopics}
              onChange={handleTopicChange}
              placeholder="Select topics..."
            />
          </div>
        </div>

        <h1 className="px-5 text-blue-600 text-center mb-5">
          <strong>Try Questions!!!</strong>
        </h1>

        {filteredQuestions
          .filter((ques) =>
            ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
          )
          .map((ques) => (
            <div key={ques._id} className="flex items-center mb-5">
              <div className="w-6 mr-2">{getStatusIcon(ques._id)}</div>
              <Link to={"/question/" + ques?.titleslug} className="flex-1">
                <div className="flex justify-between p-5 border border-gray-800 rounded-lg hover:border-gray-700 transition duration-300 hover:shadow-md">
                  <div className="text-white">
                    <h1 className="text-lg">
                      <strong>{ques?.title}</strong>
                    </h1>
                    <div className="flex flex-wrap mt-2">
                      {formatTopics(ques?.topics)}
                    </div>
                  </div>
                  <p
                    className={` ${
                      ques.level === "easy"
                        ? "text-green-500"
                        : ques.level === "medium"
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                  >
                    <strong>{ques?.level}</strong>
                  </p>
                </div>
              </Link>
            </div>
          ))}
        {queslist.length > 0 &&
          filteredQuestions.filter((ques) =>
            ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
          ).length === 0 && <p className="text-white">No questions found</p>}
      </div>
    </div>
  );
};

export default Question;
