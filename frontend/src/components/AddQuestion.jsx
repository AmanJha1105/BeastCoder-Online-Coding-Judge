import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const AddQuestion= ()=> {

  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const history=useNavigate();
  const [formData, setFormData] = useState({
    level:"",
    topics:"",
    title:"",
    likes:"",
    testcases:"",
    dislikes:"",
    content:"",
    constraints:"",
    sampleTestcases:"",
  });
  const handleChange = (e) => {
    setFormData((prev)=>({ ...prev, [e.target.id]: e.target.value }));
  };

  const sendRequest = async ()=>{
    const res= await axios
    .post(`${BackendUrl}/ques/add`,{
      level:formData.level,
      topics:formData.topics,
      title:formData.title,
      likes:formData.likes,
      testcases:formData.testcases,
      dislikes:formData.dislikes,
      content:formData.content,
      constraints:formData.constraints,
      sampleTestcases:formData.sampleTestcases,
    },{headers: {
      'Content-Type': 'application/json',
    }},).catch(err=>console.log(err));
    const data = await res.data;
    return data;
  }

  const handleSubmit =  (e) => {
    e.preventDefault();
    sendRequest().then(()=>history("/"));
    };
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Wanna Add a Question ?</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Level'
            id='level'
            className='bg-slate-100 p-3 rounded-lg'
            value={formData.level}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Topics'
            id='topics'
            className='bg-slate-100 p-3 rounded-lg'
            value={formData.topics}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Title'
            id='title'
            className='bg-slate-100 p-3 rounded-lg'
            value={formData.title}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Likes'
            id='likes'
            className='bg-slate-100 p-3 rounded-lg'
            value={formData.likes}
            onChange={handleChange}
          />
           <textarea
          placeholder='TestCases'
          id='testcases'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.testcases}
          onChange={handleChange}
          rows="8"
          cols="8"
        />
          <input
            type='text'
            placeholder='Dislikes'
            id='dislikes'
            className='bg-slate-100 p-3 rounded-lg'
            value={formData.dislikes}
            onChange={handleChange}
          />
          <textarea
          placeholder='Enter Content'
          id='content'
          className='px-2 py-2'
          value={formData.content}
          onChange={handleChange}
          rows="10"
          cols="10"
        />
         <textarea
          placeholder='Enter Constraints'
          id='constraints'
          className='px-2 py-2'
          value={formData.constraints}
          onChange={handleChange}
          rows="6"
          cols="6"
        />
        <textarea
          placeholder='Enter Sample TestCases'
          id='sampleTestcases'
          className='px-2 py-2'
          value={formData.sampleTestcases}
          onChange={handleChange}
          rows={6}
          cols={6}
        />
          <button
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            Add Question
          </button>
        </form>
      </div>
    );
}

export default AddQuestion;