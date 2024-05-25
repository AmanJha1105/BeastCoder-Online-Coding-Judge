import React ,{useState}from 'react'
import axios from 'axios';

const SolutionCard = ({selectedSolution}) => {

    const [replyContent, setReplyContent] = useState('');
    const [replies, setReplies] = useState(selectedSolution.replies);

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
          console.log(response.data.replies);
          setReplies(response.data.replies);
          console.log(response.data.replies);
          setReplyContent('');
        } catch (error) {
          console.error('Error adding reply:', error);
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
            replies.map((reply) => (
                <div key={reply._id} className="reply bg-white p-2 mb-2 rounded shadow">
                <strong>{reply.username}:</strong>
                <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{reply.content}</pre>
                <p className="text-sm text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                </div>
            ))
          )}
        </div>
      
    </>
  )
}

export default SolutionCard