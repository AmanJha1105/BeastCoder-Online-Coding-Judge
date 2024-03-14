import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import axios from "axios";

const Question = () => {

    const [queslist, setqueslist]= useState([]);

    const getQuestions = async () => {
        const res = await axios
          .get("http://localhost:5000/ques/allquestion", {
            withCredentials: true,
          })
          .catch((err) => console.log(err));
    
        const data = await res.data;
        return data;
      };

      useEffect(() => {
        getQuestions().then((data)=>setqueslist(data));
      }
       , []);
    
       return(
        <>
           <Link to="/add"><button className="border-2 border-black-300 bg-gray-300 text-cyan-950 rounded-lg p-1.5 m-5"> Add Questions </button></Link>

          <h1>hello you can solve these questions</h1>

           <div> 
            {queslist.map((ques) => (
              <Link key={ques.id} to ={"/question/"+ques.titleslug}>
              <div className="flex  border-4 border-pink-200 justify-between p-5 m-5 ">
                <h2>{ques.title}</h2>
                <p>{ques.level}</p>
              </div>
            </Link>))}
          </div>
        </>
       )

}

export default Question