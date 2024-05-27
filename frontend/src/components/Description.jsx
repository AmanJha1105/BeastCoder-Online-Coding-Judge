import React, { useEffect, useState } from 'react'
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import axios from 'axios';

const Description = ({ques}) => {

    const [likes, setLikes] = useState(ques.likes);
    const [dislikes, setDislikes] = useState(ques.dislikes);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    console.log(likes);

    useEffect(()=>{
         setLikes(ques.likes);
         setDislikes(ques.dislikes);
         const userId = localStorage.getItem('userId');
         const likedBy = ques.likedBy;
         const dislikedBy = ques.dislikedBy;
         const likedIndex = likedBy && ques.likedBy.includes(userId);

         if(!likedIndex)
            setLiked(false)
        else
            setLiked(true);

        const dislikedIndex =dislikedBy &&  ques.dislikedBy.includes(userId);

        if(!dislikedIndex)
            setDisliked(false)
        else
            setDisliked(true);
    },[ques])

    const handleLike = async () => {
        try {
            const userId = localStorage.getItem('userId');

            const response = await axios.post(`http://localhost:5000/ques/like/${ques.titleslug}`,{
                userId:userId,
            });
            console.log(response.data);
            setLikes(response.data.likes);
            setDislikes(response.data.dislikes);
            setLiked(!liked);
            if (disliked) {
                setDisliked(false);
            }
        } catch (error) {
            console.error('Error liking the question:', error);
        }
    };
    
    const handleDislike = async () => {
        try {

            const userId = localStorage.getItem('userId');

            const response = await axios.post(`http://localhost:5000/ques/dislike/${ques.titleslug}`,{
                userId:userId,
            });
            setDislikes(response.data.dislikes);
            setLikes(response.data.likes);
            setDisliked(!disliked);
            if (liked) {
                setLiked(false);
            }
        } catch (error) {
            console.error('Error disliking the question:', error);
        }
    };
    

  return (
    <div className="flex-1 p-4">
        <div><strong>{ques.title}</strong></div>
        <div>{ques.content}</div>
        <div>{ques.level}</div>
        <div>
            <button onClick={handleLike} className={`mr-2 ${liked ? 'text-blue-500' : 'text-gray-500'}`}>
                <FaThumbsUp />
            </button>{likes}
            
            <button onClick={handleDislike} className={`ml-4 mr-2 ${disliked ? 'text-black' : 'text-gray-500'}`}>
                <FaThumbsDown />
            </button>
            <span>{dislikes}</span>
        </div>
      </div>
  )
}

export default Description