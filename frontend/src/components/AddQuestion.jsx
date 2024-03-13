import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const AddQuestion= ()=> {

  const history=useNavigate();
  const [formData, setFormData] = useState({
    level:"",
    toics:"",
    title:"",
    likes:"",
    dislikes:"",
    content:"",
  });
  const handleChange = (e) => {
    setFormData((prev)=>({ ...prev, [e.target.id]: e.target.value }));
  };

  const sendRequest = async ()=>{
    const res= await axios
    .post("http://localhost:5000/ques/add",{
      level:formData.level,
      toics:formData.topics,
      title:formData.title,
      likes:0,
      dislikes:0,
      content:formData.content,
    }).catch(err=>console.log(err));
    const data = await res.data;
    return data;
  }

  const handleSubmit =  (e) => {
    e.preventDefault();
    sendRequest().then(()=>history("/user"));
    };
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
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
          <input
            type='text'
            placeholder='Dislikes'
            id='dislikes'
            className='bg-slate-100 p-3 rounded-lg'
            value={formData.dislikes}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Enter Content'
            id='content'
            className='bg-slate-100 p-3 rounded-lg'
            value={formData.content}
            onChange={handleChange}
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