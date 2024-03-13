import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {

  const history=useNavigate();
  const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:""
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev)=>({ ...prev, [e.target.id]: e.target.value }));
  };

  const sendRequest = async ()=>{
    setLoading(true);
    setError(false);
    const res= await axios
    .post("http://localhost:5000/api/signup",{
       name: formData.name,
       email: formData.email,
       password: formData.password
    }).catch(err=>console.log(err));
    const data = await res.data;
    setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
    return data;
  }

  const handleSubmit =  (e) => {
    e.preventDefault();
    sendRequest().then(()=>history("/login"));
    };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          id='name'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.password}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/login'>
          <span className='text-blue-500'>Login</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
    </div>
  );
}