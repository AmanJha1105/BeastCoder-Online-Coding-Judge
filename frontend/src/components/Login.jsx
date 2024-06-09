import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login=()=> {

  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate=useNavigate();

  const {user,setUser, login}=useContext(AuthContext);

  const [formData, setFormData] = useState({
    email:"",
    password:"",
  });
  const handleChange = (e) => {
    setFormData((prev)=>({ ...prev, [e.target.id]: e.target.value }));
  };

  const sendRequest = async ()=>{
    await login(formData.email,formData.password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
    const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/';
    localStorage.removeItem('lastVisitedPage');
    navigate(lastVisitedPage);
  };
  
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            Login
          </button>
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Dont Have an account?</p>
          <Link to='/signup'>
            <span className='text-blue-500'>Sign up</span>
          </Link>
        </div>
        {/* <p className='text-red-700 mt-5'>
          {error ? error.message || 'Something went wrong!' : ''}
        </p> */}
      </div>
    );
}

export default Login