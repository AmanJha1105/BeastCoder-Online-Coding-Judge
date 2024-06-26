import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext';

export default function SignUp() {

  const {signup} = useContext(AuthContext);

  const history=useNavigate();
  const [formData, setFormData] = useState({
    fullname:"",
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

    try {
      await signup(formData.fullname,formData.name,formData.email,formData.password);
    } catch (error) {
       toast.error("SignUp failed.")
    }
    
  }

  const handleSubmit =  (e) => {
    e.preventDefault();
    sendRequest().then(()=>history("/"));
    };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Fullname'
          id='fullname'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.fullname}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Username'
          id='name'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          value={formData.password}
          onChange={handleChange}
          required
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