import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import axios from "axios";

const Question = () => {

    const [queslist, setqueslist]= useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState(null);

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

      useEffect(() => {
        getQuestions().then((data)=>setqueslist(data));
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
            </div>
    
            <h1 className="px-5 text-blue-600 text-center mb-5"><strong>Try Questions!!!</strong></h1>
    
            <div>
              {queslist.filter((ques) =>
                ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
              ).map((ques) => (
                <Link key={ques.id} to={"/question/" + ques.titleslug}>
                  <div className="flex justify-between p-5 m-5 border border-gray-800 rounded-lg hover:border-gray-700 transition duration-300 hover:shadow-md">
                    <h2 className="text-white"><strong>{ques.title}</strong></h2>
                    <p className={`text-white ${ques.level === 'easy' ? 'text-green-500' : ques.level === 'medium' ? 'text-orange-500' : 'text-red-500'}`}>
                      <strong>{ques.level}</strong>
                    </p>
                  </div>
                </Link>
              ))}
              {queslist.length > 0 &&
                queslist.filter((ques) =>
                  ques.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
                ).length === 0 && <p className="text-white">No questions found</p>}
            </div>
          </div>
        </div>
      );

}

export default Question