import React ,{useState}from 'react'
import axios from 'axios';
import { FaThumbsUp} from 'react-icons/fa';

const SolutionCard = ({selectedSolution}) => {

    const [replyContent, setReplyContent] = useState('');
    const [sol,setSol]=useState(selectedSolution);
    const [replies, setReplies] = useState(selectedSolution.replies);

    const userId = localStorage.getItem('userId');

    replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleReply = async () => {
        const userId = localStorage.getItem('userId'); // Assume user ID is stored in localStorage
        const username = localStorage.getItem('username'); // Replace with actual username
    
        try {
          const response = await axios.post(`http://localhost:5000/ques/solution/${selectedSolution._id}/reply`, {
            userId,
            username,
            content: replyContent,
          });
          setReplies(response.data.replies);
          setReplyContent('');
        } catch (error) {
          console.error('Error adding reply:', error);
        }
    };

    const handleLikeReply = async (replyId, index) => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.post(`http://localhost:5000/ques/solutions/${selectedSolution._id}/reply/${replyId}/like`, {
          userId
        });
        const updatedReplies = [...replies];
        updatedReplies[index] = response.data.replies.find(reply => reply._id === replyId);
        const sortedReplies = updatedReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReplies(sortedReplies);

      } catch (error) {
        console.error('Error liking reply:', error);
      }
    };

    const handleLikeSolution = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.post(`http://localhost:5000/ques/solution/${selectedSolution._id}/like`, {
        userId
      });
      setSol(response.data);
    } catch (error) {
      console.error('Error liking solution:', error);
    }
  };

  return (
    <>
      
        <div className="mt-4 p-4 w-full bg-gray-100 rounded">
          <div className="flex mb-2">
            <span className="text-sm text-gray-500 w-10">{selectedSolution.username}</span>
            <span className="text-sm text-gray-500">{new Date(selectedSolution.timeOfPublish).toLocaleDateString()}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{selectedSolution.name}</h3>
          <div className="flex text-sm text-gray-700">
            <span className="mr-4">{selectedSolution.language}</span>
            <span>{selectedSolution.topics.join(', ')}</span>
          </div>
          <pre className="bg-white p-4 rounded shadow mb-4">
            <code>{selectedSolution.code}</code>
          </pre>
          <div className='flex flex-row'><button onClick={handleLikeSolution} className={`flex items-center mr-1 ${sol.likedBy.includes(userId) ? 'text-blue-500' : 'text-gray-500'}`}><FaThumbsUp /></button><span>{sol.likes}</span>
</div>
          <div className='py-2'>Comments ({replies.length})</div>
          <div className="flex flex-col items-end">
            <textarea 
              value={replyContent}
              onChange={(e)=>setReplyContent(e.target.value)}
              placeholder="Type comment here..."
              className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-2" 
              required
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <button onClick={handleReply}  className="bg-green-500 text-white px-4 py-2 rounded-lg">Comment</button>
          </div>

          {replies.length > 0 && (
            replies.map((reply,index) => (
                <div key={reply._id} className="reply bg-white p-2 mb-2 rounded shadow">
                <strong>{reply.username}:</strong>
                <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{reply.content}</pre>
                <p className="text-sm text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                <div className='flex flex-row'>
                  <button onClick={() => handleLikeReply(reply._id, index)} className={`flex items-center mr-1 ${reply.likedBy.includes(userId) ? 'text-blue-500' : 'text-gray-500'}`}><FaThumbsUp /></button> <span>{reply.likedBy.length}</span>
                </div>
                </div>
            ))
          )}
        </div>
      
    </>
  )
}

export default SolutionCard