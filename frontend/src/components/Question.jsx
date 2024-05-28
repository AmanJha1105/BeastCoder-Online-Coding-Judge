import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { FaCheckCircle} from "react-icons/fa";
import { FaCircleHalfStroke } from "react-icons/fa6";
import axios from "axios";
import Select from "react-select";


const Question = () => {

    const [queslist, setqueslist]= useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    const topics = [
      { label: 'BFS', value: 'bfs' },
      { label: 'DFS', value: 'dfs' },
      { label: 'Graphs', value: 'graphs' },
      { label: 'Queue', value: 'queue' },
      { label: 'Arrays', value: 'arrays' },
      { label: 'Mathematics', value: 'mathematics' },
      { label: 'Dynamic Programming', value: 'dp' },
      { label: 'Stacks', value: 'stacks' },
      { label: 'String', value: 'string' },
      { label: 'Matrix', value: 'matrix' },
      { label: 'Backtracking', value: 'backtracking' },
      { label: 'Linked List', value: 'linkedlist' },
      { label: 'Heaps', value: 'heaps' },
      { label: 'Tree', value: 'tree' },
      { label: 'BST', value: 'bst' },
      { label: 'Tree', value: 'tree' },
      { label: 'Binary Tree', value: 'bt' },
      { label: 'Greedy', value: 'greedy' },
      { label: 'Sorting', value: 'sorting' },
      { label: 'Recursion', value: 'recursion' },
      { label: 'Hash Table', value: 'hashtable' },
    ];

    const fetchSubmissions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log("userid",userId);
        const response = await axios.get('http://localhost:5000/ques/allsubmissions',{
            params: {
                userId: userId
            }},{ withCredentials: true });
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions', error);
      }
    };

    const handleTopicChange = (selectedOptions) => {
      setSelectedTopics(selectedOptions || []);
    };

    const filteredQuestions = queslist.filter((ques) =>
      ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
      (selectedTopics.length === 0 || selectedTopics.every(topic => ques.topics.includes(topic.value)))
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

      const handleSearch= (e)=>{
        setSearchQuery(e.target.value);
      }

      const handleQuestionClick = (quesId) => {
        setSelectedQuestion(quesId === selectedQuestion ? null : quesId);
      };

      const getStatusIcon = (questionId) => {
        const userSubmissions = submissions.filter(submission => submission.quesID === questionId);
        const isSolved = userSubmissions.some(submission => submission.verdict === "AC");
        const isAttempted = userSubmissions.length > 0;

        if (isSolved) return <FaCheckCircle className="text-green-500 ml-2" title="Solved"/>;
        if (isAttempted) return <FaCircleHalfStroke className="text-orange-500 ml-2" title="Attempted"/>;
        return null;
      };

      useEffect(() => {
        getQuestions().then((data)=>setqueslist(data));
        fetchSubmissions();
      }
       , []);
    
       return (
        <div className="bg-[url('https://wallpaperboat.com/wp-content/uploads/2019/10/coding-25.jpg')] bg-cover bg-center min-h-screen">
          <div className="bg-opacity-50 bg-gray-900 min-h-screen p-5">
            <div className="flex justify-center items-center mb-5">
              {/* Add Questions button */}
              <Link to="/add">
                <button className="border-2 border-black bg-pink-200 text-purple-950 rounded-lg p-1.5 m-2"> Add Questions </button>
              </Link>
    
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
    
            <h1 className="px-5 text-blue-600 text-center mb-5"><strong>Try Questions!!!</strong></h1>
    
            <div>
              {filteredQuestions.filter((ques) =>
                ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
              ).map((ques) => (
                <Link key={ques.id} to={"/question/" + ques.titleslug}>
                  <div className="flex justify-between p-5 m-5 border border-gray-800 rounded-lg hover:border-gray-700 transition duration-300 hover:shadow-md">
                    <h2 className="text-white"><strong>{ques.title}</strong></h2>
                    {getStatusIcon(ques._id)}
                    <p className={` ${ques.level === "easy" ? "text-green-500" : ques.level === "medium" ? "text-orange-500" : "text-red-500"}`}>
                      <strong>{ques.level}</strong>
                    </p>
                  </div>
                </Link>
              ))}
              {queslist.length > 0 &&
                filteredQuestions.filter((ques) =>
                  ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
                ).length === 0 && <p className="text-white">No questions found</p>}
            </div>
          </div>
        </div>
      );

}

export default Question