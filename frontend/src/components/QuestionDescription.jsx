import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Code from './Code';
import Description from './Description';

export default function QuestionDescription() {
    const [ques, setQues] = useState();
    const { quesID } = useParams();

    useEffect(() => {
        getQuestionDescription().then((data) => setQues(data));
    }, [quesID]);

    const getQuestionDescription = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/ques/question/${quesID}`, {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching question description:', error);
            return null;
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
                <Link className="px-2" to={`/question/${quesID}`}>
                    Description
                </Link>
                <Link className="px-2" to={`/question/${quesID}/solutions`}>
                    🧪 Solutions
                </Link>
                <Link className="px-2" to={`/question/${quesID}/submissions`}>
                    ▼ Submissions
                </Link>
                <Link className="px-2" to={`/question/${quesID}/discuss`}>
                    🗨️ Discuss
                </Link>
            </div>

            <div className="flex mx-auto">
                <div className="flex-1 p-4 overflow-y-auto max-h-screen">
                    <Description ques={ques} />
                </div>
                <div className="flex-1 p-4 overflow-y-auto max-h-screen">
                    <Code quesID={quesID} />
                </div>
            </div>
        </>
    );
}
