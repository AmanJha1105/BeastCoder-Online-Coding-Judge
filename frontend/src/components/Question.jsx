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
        console.log(data);
        console.log(Array.isArray(data));
        console.log(typeof(data[0]));

        return data;
      };

      useEffect(() => {
        getQuestions().then((data)=>setqueslist(data));
      }
       , []);
    
       return(
        <>
           <Link to="/add"><button>Add Questions </button>
           </Link>
          <h1>hello you can solve these questions</h1>
          {/* <ul>
                {queslist.map((ques) => (
                    <li key={queslist._id}>
                    Name: {queslist.title}, Level: {queslist.level}
                    </li>
                ))}
            </ul> */}
           <div>
            {queslist.map((ques) => (
              <div key={ques.id} className="flex  border-4 border-pink-200 justify-between p-5 m-5 ">
                <h2>{ques.title}</h2>
                <p>{ques.level}</p>
              </div>
            ))}
          </div>
        </>
       )

}

export default Question