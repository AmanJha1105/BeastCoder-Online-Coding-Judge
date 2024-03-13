import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import axios from "axios";

const Question = () => {

    const [queslist, setqueslist]= useState(" ");

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
        getQuestions().then((data)=>setqueslist(data[0]));
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
            <h2>{queslist.title}</h2>
        </>
       )

}

export default Question